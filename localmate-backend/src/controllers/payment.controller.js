const { createPaymentIntent, handlePaymentSuccess } = require('../services/payment.service');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const ApiResponse = require('../utils/ApiResponse');

const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey && !stripeKey.includes('xxxxxxxx')) {
  try {
    stripe = require('stripe')(stripeKey);
  } catch (e) {}
}

exports.checkout = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({
      _id: bookingId,
      touristId: req.user._id,
      status: 'PENDING'
    });

    if (!booking) return ApiResponse.notFound(res, 'Booking not found or not in pending state');

    const { clientSecret, payment } = await createPaymentIntent(booking);
    return ApiResponse.success(res, {
      clientSecret,
      paymentId: payment._id,
      amount: booking.totalAmount,
      currency: 'usd'
    });
  } catch (err) { next(err); }
};

exports.confirm = async (req, res, next) => {
  try {
    const { bookingId, paymentIntentId } = req.body;
    const booking = await Booking.findOne({
      _id: bookingId,
      touristId: req.user._id
    });

    if (!booking) return ApiResponse.notFound(res, 'Booking not found');

    const payment = await handlePaymentSuccess(paymentIntentId || bookingId);
    return ApiResponse.success(res, { booking, payment }, 'Payment confirmed successfully');
  } catch (err) { next(err); }
};

exports.webhook = async (req, res) => {
  if (!stripe) return res.json({ received: true, mock: true });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object.id);
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
  }

  res.json({ received: true });
};

exports.getHistory = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ touristId: req.user._id })
      .select('_id totalAmount status bookingDate createdAt');

    const payments = await Payment.find({
      bookingId: { $in: bookings.map(b => b._id) }
    }).populate('bookingId', 'bookingDate totalAmount status').lean();

    return ApiResponse.success(res, payments);
  } catch (err) { next(err); }
};
