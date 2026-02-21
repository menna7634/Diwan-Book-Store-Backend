const app = require('./app');
const connectDB = require('./database/connection');
const config = require('./shared/config');

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(
        `Server running on port ${config.port} in ${config.env} mode`
      );
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
