import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'knotandbloom-luxury-secret-key-super-secure-2026';
const TOKEN_NAME = 'knotandbloom_token';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Try cookie first (support new token and fallback to previous token)
  const cookieToken = request.cookies.get(TOKEN_NAME)?.value || request.cookies.get('ramazon_token')?.value;
  if (cookieToken) return cookieToken;

  // Try Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 }),
    };
  }
  return { user, errorResponse: null };
}

export async function requireAdmin(request: NextRequest) {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };

  if (user?.role !== 'ADMIN') {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Forbidden: Admin privilege required.' },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}

export { TOKEN_NAME };
