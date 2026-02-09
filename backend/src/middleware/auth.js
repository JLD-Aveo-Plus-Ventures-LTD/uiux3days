const dotenv = require('dotenv');

dotenv.config();

function adminAuth(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
}

module.exports = adminAuth;
