const admin = require('../config/firebase');
const Notification = require('../models/Notification');

const sendPush = async (fcmToken, title, body, data = {}) => {
  if (!fcmToken || !admin.apps.length) return null;
  try {
    const message = {
      token: fcmToken,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
      apns: { payload: { aps: { sound: 'default', badge: 1 } } },
      android: { priority: 'high' }
    };
    const response = await admin.messaging().send(message);
    return response;
  } catch (err) {
    console.error('FCM error:', err.message);
    return null;
  }
};

const createNotification = async (userId, title, body, type, data = {}) => {
  try {
    const notification = await Notification.create({
      userId, title, body, type, data
    });
    return notification;
  } catch (err) {
    console.error('Create notification error:', err.message);
  }
};

const notifyUser = async (user, title, body, type, data = {}) => {
  await Promise.all([
    createNotification(user._id, title, body, type, data),
    user.fcmToken ? sendPush(user.fcmToken, title, body, data) : null
  ]);
};

module.exports = { sendPush, createNotification, notifyUser };
