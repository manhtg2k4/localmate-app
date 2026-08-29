require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const { initSocket } = require('./src/config/socket');
const { startJobs } = require('./src/jobs/booking.job');

const PORT = process.env.PORT || 8080;

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  const io = initSocket(server);
  app.set('io', io);
  startJobs();
  server.listen(PORT, () => {
    console.log(`✅ LocalMate server running on port ${PORT}`);
    console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
  });
};

start().catch(console.error);
