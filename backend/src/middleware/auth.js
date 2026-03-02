const dotenv = require('dotenv');

dotenv.config();

function adminAuth(req, res, next) {
  const password = req.headers['x-admin-password'];
  
  if (!password) {
    return res.status(401).json({ 
      code: 'MISSING_PASSWORD',
      message: 'Admin password required' 
    });
  }
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ 
      code: 'INVALID_PASSWORD',
      message: 'Invalid admin password' 
    });
  }
  
  return next();
}

module.exports = adminAuth;
