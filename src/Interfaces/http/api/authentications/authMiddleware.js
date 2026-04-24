import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';

const authMiddleware = (container) => async (req, res, next) => {
  try {
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
    const { id } = await tokenManager.decodePayload(token);

    req.auth = { id };

    return next();
  } catch { // Variabel error dihapus biar ESLint nggak cerewet
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token',
    });
  }
};

export default authMiddleware;