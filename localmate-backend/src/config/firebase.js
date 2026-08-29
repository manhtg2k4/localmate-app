const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    const key = process.env.FIREBASE_PRIVATE_KEY;
    if (key && !key.includes('xxxxxxxx')) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: key.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
      });
    } else {
      console.warn('⚠️ Firebase credentials not configured or using placeholder key. Firebase push notifications disabled.');
    }
  } catch (err) {
    console.warn('⚠️ Failed to initialize Firebase Admin:', err.message);
  }
}

module.exports = admin;
