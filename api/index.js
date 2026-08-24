const app = require('../backend/dist/app');

module.exports = (req, res) => {
  const expressApp = app.default || app;
  return expressApp(req, res);
};
