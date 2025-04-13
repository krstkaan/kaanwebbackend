import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiResponse } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

// jwt token dogrulama
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // authorizationda token yoksa hata don
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ApiResponse.error({
      res,
      statusCode: 403,
      message: 'Token gerekli',
    });
    return;
  }

  // headerdan gelen token aliniyor
  const token = authHeader.split(' ')[1];

  try {
    // token verifyToken fonksiyonu ile cozup kullanıcı id aliyoruz
    const decoded = verifyToken(token) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    // token dogrulama basarisiz hata don
    ApiResponse.error({
      res,
      statusCode: 403,
      message: 'Geçersiz token',
    });
  }
};