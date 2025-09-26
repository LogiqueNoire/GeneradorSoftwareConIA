/**
 * Configuración de autenticación centralizada
 * Similar a application.properties de Spring Boot
 */

export interface AuthProvider {
  id: string;
  name: string;
  enabled: boolean;
  clientId?: string;
  clientSecret?: string;
  issuer?: string;
  scope?: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
  icon?: string;
  buttonColor?: string;
}

export interface AuthConfig {
  providers: {
    google: AuthProvider;
    microsoft: AuthProvider;
    local: AuthProvider;
  };
  session: {
    strategy: 'jwt' | 'database';
    maxAge: number; // en segundos
    updateAge: number; // en segundos
  };
  callbacks: {
    redirect: {
      signIn: string;
      signOut: string;
    };
  };
  pages: {
    signIn: string;
    signOut: string;
    error: string;
  };
}

// Configuración por defecto
export const defaultAuthConfig: AuthConfig = {
  providers: {
    google: {
      id: 'google',
      name: 'Google',
      enabled: false, // Se determinará dinámicamente
      clientId: undefined,
      clientSecret: undefined,
      scope: 'openid email profile',
      icon: '🌐',
      buttonColor: '#4285f4'
    },
    microsoft: {
      id: 'azure-ad',
      name: 'Microsoft',
      enabled: false, // Se determinará dinámicamente
      clientId: undefined,
      clientSecret: undefined,
      issuer: undefined,
      scope: 'openid email profile',
      icon: '🏢',
      buttonColor: '#0078d4'
    },
    local: {
      id: 'credentials',
      name: 'Email y Contraseña',
      enabled: false, // Deshabilitado para SSO puro
      icon: '🔐',
      buttonColor: '#6b7280'
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
    updateAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    redirect: {
      signIn: '/portal',
      signOut: '/'
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error'
  }
};

/**
 * Obtiene la configuración de autenticación
 * Permite sobrescribir configuraciones mediante variables de entorno
 */
export function getAuthConfig(): AuthConfig {
  const config = { ...defaultAuthConfig };
  
  // Sobrescribir configuración mediante variables de entorno
  if (process.env.AUTH_SESSION_MAX_AGE) {
    config.session.maxAge = parseInt(process.env.AUTH_SESSION_MAX_AGE);
  }
  
  if (process.env.AUTH_REDIRECT_SIGNIN) {
    config.callbacks.redirect.signIn = process.env.AUTH_REDIRECT_SIGNIN;
  }
  
  if (process.env.AUTH_REDIRECT_SIGNOUT) {
    config.callbacks.redirect.signOut = process.env.AUTH_REDIRECT_SIGNOUT;
  }
  
  return config;
}

/**
 * Obtiene solo los proveedores habilitados
 */
export function getEnabledProviders(): AuthProvider[] {
  const config = getAuthConfig();
  return Object.values(config.providers).filter(provider => provider.enabled);
}