const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

/**
 * POST /api/webhooks/stripe
 * Stripe webhooks receiver. Uses raw body to verify signature.
 */
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, productId, vendorId, productType } = session.metadata;

        if (productType === 'subscription') {
          // Handle recurring subscription creation
          const stripeSubId = session.subscription;
          const subscriptionDetails = await stripe.subscriptions.retrieve(stripeSubId);

          await Subscription.findOneAndUpdate(
            { stripeSubId },
            {
              userId,
              productId,
              stripeSubId,
              status: subscriptionDetails.status,
              currentPeriodEnd: new Date(subscriptionDetails.current_period_end * 1000),
            },
            { upsert: true, new: true }
          );

          // Track order records (first subscription payment)
          const amountTotal = session.amount_total / 100;
          const platformFeePercent = 10; // Vendor commission configuration fallback
          const platformFee = (amountTotal * platformFeePercent) / 100;

          await Order.create({
            userId,
            productId,
            vendorId,
            amount: amountTotal,
            platformFee,
            stripeSessionId: session.id,
            paid: true,
          });

          // Credit vendor total revenue
          const netVendorRevenue = amountTotal - platformFee;
          await Vendor.findByIdAndUpdate(vendorId, {
            $inc: { totalRevenue: netVendorRevenue },
          });

        } else {
          // Handle one-time payment orders
          const amountTotal = session.amount_total / 100;
          const vendor = await Vendor.findById(vendorId);
          const commissionPercent = vendor ? vendor.commission : 10;
          const platformFee = (amountTotal * commissionPercent) / 100;
          const netVendorRevenue = amountTotal - platformFee;

          await Order.findOneAndUpdate(
            { stripeSessionId: session.id },
            {
              userId,
              productId,
              vendorId,
              amount: amountTotal,
              platformFee,
              stripeSessionId: session.id,
              paid: true,
            },
            { upsert: true, new: true }
          );

          await Vendor.findByIdAndUpdate(vendorId, {
            $inc: { totalRevenue: netVendorRevenue },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await Subscription.findOneAndUpdate(
          { stripeSubId: subscription.id },
          {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          }
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await Subscription.findOneAndUpdate(
          { stripeSubId: subscription.id },
          {
            status: 'canceled',
          }
        );
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
});

module.exports = router;
