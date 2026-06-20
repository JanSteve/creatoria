const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Vendor = require('../models/Vendor');
const auth = require('../middleware/auth');
const { generateDownloadUrl } = require('../utils/s3SignedUrl');

/**
 * POST /api/checkout/create-session
 * Create a Stripe checkout session for a product.
 */
router.post('/create-session', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    const product = await Product.findById(productId).populate('vendorId');
    if (!product || !product.active) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive.',
      });
    }

    const vendor = product.vendorId;
    if (!vendor || !vendor.stripeAccountId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor Stripe account is not fully configured.',
      });
    }

    const priceInCents = Math.round(product.price * 100);

    // Differentiate between payment modes
    const mode = product.type === 'subscription' ? 'subscription' : 'payment';

    // Calculate platform fee based on vendor commission percentage (e.g. 10%)
    const platformFeePercent = vendor.commission || 10;
    const applicationFeeAmount = Math.round((priceInCents * platformFeePercent) / 100);

    const sessionOptions = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.description.substring(0, 500),
            },
            unit_amount: priceInCents,
            ...(product.type === 'subscription' && {
              recurring: { interval: 'month' },
            }),
          },
          quantity: 1,
        },
      ],
      mode,
      success_url: `${process.env.FRONTEND_URL}/dashboard/user?checkout_success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/product/${product._id}?checkout_cancelled=true`,
      metadata: {
        userId: req.user.id.toString(),
        productId: product._id.toString(),
        vendorId: vendor._id.toString(),
        productType: product.type,
      },
    };

    // If Stripe Connect Express is used, set direct payment to the connected account,
    // and split fees via application_fee_amount
    if (mode === 'payment') {
      sessionOptions.payment_intent_data = {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: vendor.stripeAccountId,
        },
      };
    } else {
      sessionOptions.subscription_data = {
        application_fee_percent: platformFeePercent,
        transfer_data: {
          destination: vendor.stripeAccountId,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating checkout session.',
    });
  }
});

/**
 * GET /api/checkout/download/:productId
 * Fetch S3 signed download URL if the user has purchased the product or has an active subscription.
 */
router.get('/download/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    let hasAccess = false;

    if (product.type === 'subscription') {
      const activeSub = await Subscription.findOne({
        userId: req.user.id,
        productId: product._id,
        status: { $in: ['active', 'trialing'] },
      });
      if (activeSub) {
        hasAccess = true;
      }
    } else {
      const paidOrder = await Order.findOne({
        userId: req.user.id,
        productId: product._id,
        paid: true,
      });
      if (paidOrder) {
        hasAccess = true;
      }
    }

    // Always give admin access
    if (req.user.role === 'admin') {
      hasAccess = true;
    }

    // Let the vendor download their own files
    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (vendor && product.vendorId.toString() === vendor._id.toString()) {
      hasAccess = true;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You have not purchased this product or do not have an active subscription.',
      });
    }

    // Increment downloads count asynchronously
    Product.findByIdAndUpdate(product._id, { $inc: { downloads: 1 } }).exec();

    // Generate S3 URL
    const url = await generateDownloadUrl(product.fileKey);

    res.json({
      success: true,
      data: { url },
    });
  } catch (error) {
    console.error('Secure download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating download link.',
    });
  }
});

module.exports = router;
