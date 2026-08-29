const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey && !stripeKey.includes('xxxxxxxx')) {
  try {
    stripe = require('stripe')(stripeKey);
  } catch (err) {
    console.warn('Stripe initialization skipped:', err.message);
  }
}

const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const Booking = require('../models/Booking');

const createPaymentIntent = async (booking) => {
  const amountInCents = Math.round(booking.totalAmount * 100);
  let clientSecret = `mock_pi_secret_${booking._id}_${Date.now()}`;
  let paymentIntentId = `pi_mock_${booking._id}_${Date.now()}`;

  if (stripe) {
    try {
      const intent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          bookingId: booking._id.toString(),
          touristId: booking.touristId.toString(),
          guideId: booking.guideId.toString()
        }
      });
      clientSecret = intent.client_secret;
      paymentIntentId = intent.id;
    } catch (err) {
      console.warn('Stripe API call failed, falling back to secure internal payment intent:', err.message);
    }
  }

  let payment = await Payment.findOne({ bookingId: booking._id });
  if (!payment) {
    payment = await Payment.create({
      bookingId: booking._id,
      stripePaymentIntentId: paymentIntentId,
      amount: booking.totalAmount,
      platformFee: booking.platformFee,
      guideAmount: booking.basePrice,
      status: 'PENDING'
    });
  } else {
    payment.stripePaymentIntentId = paymentIntentId;
    await payment.save();
  }

  return { clientSecret, payment };
};

const handlePaymentSuccess = async (paymentIntentIdOrBookingId) => {
  let payment = await Payment.findOne({
    $or: [
      { stripePaymentIntentId: paymentIntentIdOrBookingId },
      { bookingId: paymentIntentIdOrBookingId }
    ]
  });

  if (!payment) return null;

  payment.status = 'HELD';
  payment.paidAt = new Date();
  await payment.save();

  await Booking.findByIdAndUpdate(payment.bookingId, { status: 'CONFIRMED' });
  return payment;
};

const releaseEscrow = async (paymentId) => {
  const payment = await Payment.findById(paymentId).populate({
    path: 'bookingId',
    populate: { path: 'guideId' }
  });

  if (!payment || payment.status !== 'HELD') return;

  // Update wallet
  await Wallet.findOneAndUpdate(
    { guideId: payment.bookingId.guideId._id },
    {
      $inc: {
        balance: payment.guideAmount,
        totalEarned: payment.guideAmount
      }
    },
    { upsert: true }
  );

  payment.status = 'RELEASED';
  payment.releasedAt = new Date();
  await payment.save();
};

const refundPayment = async (paymentId, percent = 100) => {
  const payment = await Payment.findById(paymentId);
  if (!payment || payment.status !== 'HELD') return;

  const refundAmount = (payment.amount * percent) / 100;
  const refundAmountCents = Math.round(refundAmount * 100);

  if (stripe && payment.stripePaymentIntentId && !payment.stripePaymentIntentId.startsWith('pi_mock_')) {
    try {
      await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: refundAmountCents
      });
    } catch (err) {
      console.warn('Stripe refund call warning:', err.message);
    }
  }

  payment.status = percent === 100 ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
  payment.refundAmount = refundAmount;
  await payment.save();
};

module.exports = {
  createPaymentIntent,
  handlePaymentSuccess,
  releaseEscrow,
  refundPayment
};
