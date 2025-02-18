import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export interface JWTPayload {
  userId: string;
  email: string;
  companyName: string;
  businessType: string;
}

export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    companyName: user.companyName,
    businessType: user.businessType,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return null;
    }

    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    return token;
  } catch (error) {
    return null;
  }
}

export async function authenticateRequest(req: NextApiRequest): Promise<JWTPayload | null> {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return null;
    }

    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export function isAuthenticated(req: NextApiRequest): boolean {
  const token = getTokenFromRequest(req);
  if (!token) return false;
  
  try {
    verifyToken(token);
    return true;
  } catch (error) {
    return false;
  }
} 