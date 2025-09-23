export interface Article {
  id: number
  title: string
  subtitle?: string
  content: string
  tag?: string
  publish_date: string
  read_time: number
  created_at: string
  updated_at: string
}

export interface CreateArticleRequest {
  title: string
  subtitle?: string
  content: string
  tag?: string
  read_time?: number
}

// Tipos extendidos para NextAuth
export interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  provider?: string;
  image?: string;
}

export interface ExtendedSession {
  user: ExtendedUser;
  expires: string;
}

export interface ExtendedJWT {
  sub: string;
  email: string;
  name?: string;
  role?: string;
  provider?: string;
  iat?: number;
  exp?: number;
}
