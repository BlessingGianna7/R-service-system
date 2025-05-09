const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const sequelize = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const morgan = require('morgan')

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true 
}));

// Check email configuration on startup
const checkEmailConfig = () => {
  const emailUser = process.env.EMAIL || process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;
  
  if (!emailUser || !emailPass) {
    console.warn('WARNING: Email configuration is missing or incomplete');
    console.warn('Set EMAIL/EMAIL_USER and EMAIL_PASS/EMAIL_PASSWORD environment variables');
  } else {
    console.log('Email configuration detected');
  }
};

app.use(morgan())
// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

// Check configurations
checkEmailConfig();

sequelize.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to the database:', err);
  });
