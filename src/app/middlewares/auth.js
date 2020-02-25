import JwtWebToken from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/authConfig';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token not provider',
    });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(JwtWebToken.verify)(
      token,
      authConfig.authSecret
    );

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token invalid',
    });
  }
};
