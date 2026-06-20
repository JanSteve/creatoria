const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    stripeSubId: {
      type: String,
      required: [true, 'Stripe subscription ID is required'],
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing'],
      default: 'active',
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick user subscription lookups
subscriptionSchema.index({ userId: 1, productId: 1 });
subscriptionSchema.index({ stripeSubId: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
