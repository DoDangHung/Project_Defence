import jwt from 'jsonwebtoken';

// Middleware để verify JWT token
export const authenticateToken = (req, res, next) => {
  console.log('AUTH FIRING ON:', req.originalUrl);
  try {
    // Lấy token từ header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token',
        });
      }

      // Lưu thông tin user vào request
      req.user = decoded;
      console.log('Decoded token:', req.user);

      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// Middleware để check role
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // req.user được set bởi authenticateToken middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Check role (case-insensitive)
      const userRole = req.user.roleName?.toLowerCase();
      const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

      if (!normalizedAllowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
      });
    }
  };
};

// Middleware kiểm tra doctor role cụ thể
export const checkDoctorRole = (req, res, next) => {
  return authorizeRole('Doctor')(req, res, next);
};

// Middleware kiểm tra admin role cụ thể
export const checkAdminRole = (req, res, next) => {
  return authorizeRole('Admin')(req, res, next);
};
