const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Memastikan adanya token di header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'secret123'); 
    req.user = decoded; 
    next();
  } catch (ex) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};
