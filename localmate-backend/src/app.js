const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL, process.env.ADMIN_URL]
    : true,
  credentials: true
}));

// Raw body for Stripe webhook
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});
app.use('/api/', limiter);

// Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'LocalMate API', version: '1.0.0', description: 'RESTful API for LocalMate Travel Guide Marketplace' },
    paths: {
      '/health': { get: { summary: 'Health Check', responses: { 200: { description: 'Server healthy' } } } },
      '/api/v1/auth/login': { post: { summary: 'Login', tags: ['Auth'] } },
      '/api/v1/auth/register': { post: { summary: 'Register', tags: ['Auth'] } },
      '/api/v1/guides': { get: { summary: 'List Guides', tags: ['Guides'] } },
      '/api/v1/locations': { get: { summary: 'List Locations', tags: ['Locations'] } },
      '/api/v1/bookings': { get: { summary: 'Get User Bookings', tags: ['Bookings'] }, post: { summary: 'Create Booking', tags: ['Bookings'] } },
      '/api/v1/wallet/me': { get: { summary: 'Get Wallet Balance', tags: ['Wallet'] } }
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/guides', require('./routes/guide.routes'));
app.use('/api/v1/locations', require('./routes/location.routes'));
app.use('/api/v1/bookings', require('./routes/booking.routes'));
app.use('/api/v1/payments', require('./routes/payment.routes'));
app.use('/api/v1/reviews', require('./routes/review.routes'));
app.use('/api/v1/ai', require('./routes/ai.routes'));
app.use('/api/v1/chat', require('./routes/chat.routes'));
app.use('/api/v1/wallet', require('./routes/wallet.routes'));
app.use('/api/v1/notifications', require('./routes/notification.routes'));
app.use('/api/v1/bookmarks', require('./routes/bookmark.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));

// Health & Root check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 LocalMate API Server is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      auth: '/api/v1/auth',
      guides: '/api/v1/guides',
      locations: '/api/v1/locations'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(require('./middleware/error.middleware'));

module.exports = app;
