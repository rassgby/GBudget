import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'votre-secret-tres-securise-changez-moi-en-production'
);

export async function getUserFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}
