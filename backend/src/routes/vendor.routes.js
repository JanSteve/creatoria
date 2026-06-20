const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const stripe = require('../config/stripe');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');

// All vendor routes require authentication
router.use(auth);

/**
 * POST /api/vendors/apply
 * Apply to become a vendor. Creates Stripe Connect express account.
 */
router.post('/apply', async (req, res) => {
  try {
    const { storeName, storeDescription } = req.body;

    if (!storeName) {
      return res.status(400).json({
        success: false,
        message: 'Store name is required.',
      });
    }

    // Check if user already applied
    const existingVendor = await Vendor.findOne({ userId: req.user.id });
    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied as a vendor.',
      });
    }

    // Create Stripe Connect express account
    const stripeAccount = await stripe.accounts.create({
      type: 'express',
      email: req.user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Create vendor profile
    const vendor = await Vendor.create({
      userId: req.user.id,
      storeName,
      storeDescription: storeDescription || '',
      stripeAccountId: stripeAccount.id,
    });

    // Update user role to vendor
    await User.findByIdAndUpdate(req.user.id, { role: 'vendor' });

    res.status(201).json({
      success: true,
      message: 'Vendor application submitted successfully.',
      data: { vendor },
    });
  } catch (error) {
    console.error('Vendor apply error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during vendor application.',
    });
  }
});

/**
 * GET /api/vendors/onboard
 * Generate a Stripe account link for onboarding.
 */
router.get('/onboard', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found. Please apply first.',
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: vendor.stripeAccountId,
      refresh_url: `${process.env.FRONTEND_URL}/dashboard/vendor?refresh=true`,
      return_url: `${process.env.FRONTEND_URL}/dashboard/vendor?onboarded=true`,
      type: 'account_onboarding',
    });

    res.json({
      success: true,
      data: { url: accountLink.url },
    });
  } catch (error) {
    console.error('Vendor onboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Stripe onboarding.',
    });
  }
});

/**
 * GET /api/vendors/dashboard
 * Return vendor dashboard statistics.
 */
router.get('/dashboard', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found.',
      });
    }

    const [products, orders, subscriptions] = await Promise.all([
      Product.find({ vendorId: vendor._id }),
      Order.find({ vendorId: vendor._id, paid: true }),
      Subscription.find({
        productId: { $in: await Product.find({ vendorId: vendor._id }).distinct('_id') },
        status: 'active',
      }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalSales = orders.length;
    const activeProducts = products.filter((p) => p.active).length;
    const activeSubscribers = subscriptions.length;

    res.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          totalSales,
          activeProducts,
          activeSubscribers,
        },
        products,
        recentOrders: orders.slice(-10).reverse(),
      },
    });
  } catch (error) {
    console.error('Vendor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching vendor dashboard.',
    });
  }
});

/**
 * GET /api/vendors/pending (Admin only)
 * List all pending vendor approvals.
 */
router.get('/pending', isAdmin, async (req, res) => {
  try {
    const pendingVendors = await Vendor.find({ approved: false }).populate(
      'userId',
      'name email'
    );

    res.json({
      success: true,
      data: { vendors: pendingVendors },
    });
  } catch (error) {
    console.error('Pending vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching pending vendors.',
    });
  }
});

/**
 * PUT /api/vendors/:id/approve (Admin only)
 * Approve a vendor application.
 */
router.put('/:id/approve', isAdmin, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.',
      });
    }

    res.json({
      success: true,
      message: 'Vendor approved successfully.',
      data: { vendor },
    });
  } catch (error) {
    console.error('Vendor approve error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving vendor.',
    });
  }
});

module.exports = router;
