const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
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
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Order amount is required'],
      min: 0,
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick user purchase lookups
orderSchema.index({ userId: 1, productId: 1 });
orderSchema.index({ vendorId: 1 });

module.exports = mongoose.model('Order', orderSchema);
