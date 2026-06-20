const Stripe = require('stripe');

/**
 * Configured Stripe instance for payment processing.
 * @type {import('stripe').Stripe}
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

module.exports = stripe;
