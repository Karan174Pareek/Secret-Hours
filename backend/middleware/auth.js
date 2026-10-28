import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'zariya_couture_jwt_secret_dev_32chars';

export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1]) || req.cookies?.zariya_admin_token;

  if (!token) {
    return res.status(401).json({ error: true, message: 'Atelier administrator authorization required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'atelier_manager') {
      return res.status(403).json({ error: true, message: 'Forbidden. Administrator privileges required.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Invalid or expired authentication session.' });
  }
};

export default requireAdmin;
