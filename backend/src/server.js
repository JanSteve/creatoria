require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start server after connecting to database
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Creatoria Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Handle Unhandled Rejections and Uncaught Exceptions
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection! Shutting down gracefully...', err);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception! Shutting down gracefully...', err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle termination signals
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
