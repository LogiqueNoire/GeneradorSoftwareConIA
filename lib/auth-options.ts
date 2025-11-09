import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { UserService } from './database';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Microsoft Azure AD Provider
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID || 'common',
          })
        ]
      : [])
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    error: '/login?error=AuthError',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email || !account) {  
          return false;
        }

        // Guardar/actualizar usuario en la base de datos
        const result = await UserService.getOrCreateUserFromSSO({
          email: user.email,
          provider: account.provider,
          ssoUserId: account.providerAccountId || user.id,
          name: user.name || undefined,
          givenName: (profile as any)?.given_name || undefined,
          familyName: (profile as any)?.family_name || undefined,
          pictureUrl: user.image || undefined,
          locale: (profile as any)?.locale || undefined,
          profile: profile || undefined,
          accessToken: account.access_token || undefined,
          refreshToken: account.refresh_token || undefined,
        });

        if (!result) {  
          return false;
        }

        const { user: dbUser, isNewUser } = result;

        // Log del evento de login
        await UserService.logAuthEvent({
          userId: dbUser.id,
          email: user.email,
          provider: account.provider,
          action: 'login',
          success: true,
        });

        return true;
      } catch (error) {  
         
        if (user.email && account) {
          await UserService.logAuthEvent({
            email: user.email,
            provider: account.provider,
            action: 'failed_login',
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          });
        }
        
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Siempre redirigir al portal después del login exitoso
      
      // Si viene con callbackUrl específico, usarlo
      if (url.includes('callbackUrl=')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const callbackUrl = urlParams.get('callbackUrl');
        if (callbackUrl) {
          return `${baseUrl}${callbackUrl}`;
        }
      }
      
      // Si la URL ya incluye portal, mantenerla
      if (url.includes('/portal')) {
        return url.startsWith("/") ? `${baseUrl}${url}` : url;
      }
      
      // Por defecto, siempre ir al portal
      return `${baseUrl}/portal`;
    },
    async jwt({ token, account, user, trigger }) {
      // Agregar información adicional al token si es necesario
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        
        // Obtener el usuario de la DB para agregar info adicional
        if (user.email) {
          const dbUser = await UserService.getUserByEmail(user.email);
          if (dbUser) {
            token.role = dbUser.role;
            token.status = dbUser.status;
            token.dbUserId = dbUser.id;
            token.tourCompleted = dbUser.tour_completed;
          }
        }
      }
      
      // Revalidar información cuando se llama session.update()
      if (trigger === 'update' && token.sub) {
        const dbUser = await UserService.getUserByEmail(token.email as string);
        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.dbUserId = dbUser.id;
          token.tourCompleted = dbUser.tour_completed;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Agregar información del token a la sesión
      if (token && session.user) {
        session.user.id = token.sub as string;
        // Agregar info de la DB
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
        (session.user as any).dbUserId = token.dbUserId;
        (session.user as any).provider = token.provider;
        (session.user as any).tourCompleted = token.tourCompleted;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
