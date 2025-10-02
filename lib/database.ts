import { Pool } from 'pg';

// Configuración de PostgreSQL (usando Neon o tu DB actual)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export { pool as db };

// Tipos TypeScript para la base de datos
export interface User {
  id: string;
  sso_provider: string;
  sso_user_id: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture_url?: string;
  locale?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  company?: string;
  department?: string;
  sso_profile?: any;
  tour_completed: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface AuthLog {
  id: string;
  user_id?: string;
  email: string;
  provider: string;
  action: 'login' | 'logout' | 'failed_login';
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  created_at: string;
}

// Funciones helper para manejar usuarios con PostgreSQL
export class UserService {
  /**
   * Obtiene o crea un usuario desde datos de SSO
   * Retorna { user, isNewUser }
   */
  static async getOrCreateUserFromSSO(ssoData: {
    email: string;
    provider: string;
    ssoUserId: string;
    name?: string;
    givenName?: string;
    familyName?: string;
    pictureUrl?: string;
    locale?: string;
    profile?: any;
    accessToken?: string;
    refreshToken?: string;
  }): Promise<{ user: User; isNewUser: boolean } | null> {
    try {
      const client = await pool.connect();

      try {
        // Primero verificar si el usuario ya existe
        const existingUser = await client.query(
          'SELECT * FROM users WHERE email = $1 OR (sso_provider = $2 AND sso_user_id = $3)',
          [ssoData.email, ssoData.provider, ssoData.ssoUserId]
        );

        if (existingUser.rows.length > 0) {
          // Usuario existente - actualizar
          const updateResult = await client.query(
            `UPDATE users SET
              name = COALESCE($1, name),
              given_name = COALESCE($2, given_name),
              family_name = COALESCE($3, family_name),
              picture_url = COALESCE($4, picture_url),
              locale = COALESCE($5, locale),
              sso_profile = COALESCE($6, sso_profile),
              access_token = $7,
              refresh_token = $8,
              last_login_at = NOW(),
              updated_at = NOW()
            WHERE id = $9
            RETURNING *`,
            [
              ssoData.name,
              ssoData.givenName,
              ssoData.familyName,
              ssoData.pictureUrl,
              ssoData.locale,
              JSON.stringify(ssoData.profile),
              ssoData.accessToken,
              ssoData.refreshToken,
              existingUser.rows[0].id
            ]
          );
          return {
            user: updateResult.rows[0] as User,
            isNewUser: false
          };
        } else {
          // Usuario nuevo - crear con tour_completed = false
          const insertResult = await client.query(
            `INSERT INTO users (
              email, sso_provider, sso_user_id, name, given_name, family_name,
              picture_url, locale, sso_profile, access_token, refresh_token,
              last_login_at, email_verified, tour_completed
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), true, false)
            RETURNING *`,
            [
              ssoData.email,
              ssoData.provider,
              ssoData.ssoUserId,
              ssoData.name,
              ssoData.givenName,
              ssoData.familyName,
              ssoData.pictureUrl,
              ssoData.locale,
              JSON.stringify(ssoData.profile),
              ssoData.accessToken,
              ssoData.refreshToken,
            ]
          );
          return {
            user: insertResult.rows[0] as User,
            isNewUser: true
          };
        }
      } finally {
        client.release();
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtiene un usuario por email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const client = await pool.connect();

      try {
        const result = await client.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );

        return result.rows[0] as User | null;
      } finally {
        client.release();
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * Actualiza el último login de un usuario
   */
  static async updateLastLogin(userId: string): Promise<boolean> {
    try {
      const client = await pool.connect();

      try {
        await client.query(
          'UPDATE users SET last_login_at = NOW() WHERE id = $1',
          [userId]
        );

        return true;
      } finally {
        client.release();
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Registra un evento de autenticación
   */
  static async logAuthEvent(logData: {
    userId?: string;
    email: string;
    provider: string;
    action: 'login' | 'logout' | 'failed_login';
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    errorMessage?: string;
  }): Promise<boolean> {
    try {
      const client = await pool.connect();

      try {
        await client.query(
          `INSERT INTO auth_logs (user_id, email, provider, action, ip_address, user_agent, success, error_message)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            logData.userId,
            logData.email,
            logData.provider,
            logData.action,
            logData.ipAddress,
            logData.userAgent,
            logData.success ?? true,
            logData.errorMessage,
          ]
        );

        return true;
      } finally {
        client.release();
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene todos los usuarios (solo para admins)
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const client = await pool.connect();

      try {
        const result = await client.query(
          'SELECT * FROM users ORDER BY created_at DESC'
        );

        return result.rows as User[];
      } finally {
        client.release();
      }
    } catch (error) {
      return [];
    }
  }

  /**
   * Actualiza el rol de un usuario
   */
  static async updateUserRole(userId: string, role: 'admin' | 'user' | 'viewer'): Promise<boolean> {
    try {
      const client = await pool.connect();

      try {
        await client.query(
          'UPDATE users SET role = $1 WHERE id = $2',
          [role, userId]
        );

        return true;
      } finally {
        client.release();
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Cambia el estado de un usuario
   */
  static async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<boolean> {
    try {
      const client = await pool.connect();

      try {
        await client.query(
          'UPDATE users SET status = $1 WHERE id = $2',
          [status, userId]
        );

        return true;
      } finally {
        client.release();
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Marca el tour como completado para un usuario
   */
  static async markTourCompleted(userId: string): Promise<boolean> {
    try {
      const client = await pool.connect();

      try {
        await client.query(
          'UPDATE users SET tour_completed = true WHERE id = $1',
          [userId]
        );

        return true;
      } finally {
        client.release();
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si un usuario necesita ver el tour
   */
  static async shouldShowTour(userId: string): Promise<boolean> {
    try {
      const client = await pool.connect();

      try {
        const result = await client.query(
          'SELECT tour_completed FROM users WHERE id = $1',
          [userId]
        );

        if (result.rows.length === 0) return false;

        return !result.rows[0].tour_completed;
      } finally {
        client.release();
      }
    } catch (error) {
      return false;
    }
  }
}
