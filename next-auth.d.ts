import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role?: 'admin' | 'user' | 'viewer';
      status?: 'active' | 'inactive' | 'suspended';
      dbUserId?: string;
      provider?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: 'admin' | 'user' | 'viewer';
    status?: 'active' | 'inactive' | 'suspended';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'admin' | 'user' | 'viewer';
    provider?: string;
    status?: 'active' | 'inactive' | 'suspended';
    dbUserId?: string;
    accessToken?: string;
    tourCompleted?: boolean;
  }
}
