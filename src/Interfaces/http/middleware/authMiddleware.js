import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

const authMiddleware = (container) => async (req, res, next) => {
  try {
    ('DEBUG: AuthMiddleware dimulai...');

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Missing authentication',
      });
    }

    const token = authHeader.split(' ')[1];

    const tokenManager = container.getInstance(AuthenticationTokenManager.name);

    await tokenManager.verifyAccessToken(token);
    const payload = await tokenManager.decodePayload(token);

    ('DEBUG: Auth sukses:', payload);

    req.auth = {
      id: payload.id || payload.userId, // 🔥 FIX FLEXIBLE
    };

    next();
  } catch (error) {
    ('DEBUG: Auth Gagal ->', error.message);

    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token',
    });
  }
};

export default authMiddleware;