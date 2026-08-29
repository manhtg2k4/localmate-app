const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"LocalMate" <${process.env.GMAIL_USER}>`,
      to, subject, html
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

const sendBookingConfirmed = async (tourist, booking) => {
  await sendEmail({
    to: tourist.email,
    subject: 'Booking Confirmed — LocalMate',
    html: `<h2>Your booking is confirmed!</h2>
           <p>Date: ${booking.bookingDate}</p>
           <p>Time: ${booking.startTime} - ${booking.endTime}</p>
           <p>Total: $${booking.totalAmount}</p>`
  });
};

const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to LocalMate!',
    html: `<h2>Welcome ${user.fullName}!</h2>
           <p>Start exploring Vietnam with a local guide today.</p>`
  });
};

module.exports = { sendEmail, sendBookingConfirmed, sendWelcomeEmail };
