/**
 * Hassan Mehdi Portfolio — server.js
 * Express backend: serves API, connects MongoDB,
 * handles contact form → email notification
 *
 * Usage:
 *   npm install      (first time only)
 *   npm run dev      (development with auto-restart)
 *   npm start        (production)
 */

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config();         // loads .env file

const contactRoute = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ══════════════════════════════════════
   MIDDLEWARE
══════════════════════════════════════ */

/* CORS — allow your frontend origin */
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true,
}));

/* Parse JSON body */
app.use(express.json({ limit: '10kb' })); // limit prevents large payloads

/* Parse URL-encoded body */
app.use(express.urlencoded({ extended: true }));

/* Simple request logger (development) */
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

/* ══════════════════════════════════════
   ROUTES
══════════════════════════════════════ */

/* Health check — visit http://localhost:5000/api/health */
app.get('/api/health', (_req, res) => {
  res.json({
    status:   'ok',
    message:  'Hassan Mehdi Portfolio API is running',
    time:     new Date().toISOString(),
  });
});

/* Contact form route */
app.use('/api/contact', contactRoute);

/* 404 handler */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* Global error handler */
app.use((err, _req, res, _next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

/* ══════════════════════════════════════
   CONNECT MONGODB → START SERVER
══════════════════════════════════════ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📬 Contact API:   http://localhost:${PORT}/api/contact`);
      console.log(`❤️  Health check:  http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
