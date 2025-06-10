const { sequelize } = require('./models');
const app = require('./app');

const port = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
  }
}

start();
