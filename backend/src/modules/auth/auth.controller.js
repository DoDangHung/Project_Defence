import authService from './auth.service.js';
const authController = {
  // POST /api/auth/login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const ip =
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await authService.login(email, password, ip);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      console.error('Login error: Your Account will be blocked 15 mins', error);

      const statusCode = error.status || 401;

      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  },

  //POST /api/auth/register
  register: async (req, res) => {
    try {
      const result = await authService.registerUser(req.body);
      res.status(201).json({
        success: true,
        message: 'Register success',
        data: result,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  // GET /api/auth/me
  getCurrentUser: async (req, res) => {
    try {
      // req.user được set bởi authenticateToken middleware
      const user = await authService.getCurrentUser(req.user.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'User not found',
      });
    }
  },

  // POST /api/auth/logout
  logout: async (req, res) => {
    try {
      // Với JWT, logout chủ yếu là xóa token ở client
      // Có thể implement blacklist token nếu cần

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  },

  // POST /api/auth/refresh-token
  refreshToken: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required',
        });
      }

      const newToken = await authService.refreshToken(token);

      res.status(200).json({
        success: true,
        data: { token: newToken },
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed',
      });
    }
  },
};

export default authController;
