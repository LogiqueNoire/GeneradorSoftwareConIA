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

// Interfaces para el sistema de órdenes y módulos
export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  payment_reference?: string;
  customer_info: any;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  category?: string;
  monthly_price: number;
  setup_price: number;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchasedModule {
  id: number;
  order_id: string;
  module_id: string;
  module_version: string;
  monthly_price: number;
  setup_price: number;
  purchase_date: string;
  status: string;
}

export interface ModuleItem {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  type: string;
  is_required: boolean;
  default_value?: string;
  placeholder_text?: string;
  validation_rules?: any;
  sort_order: number;
  created_at: string;
}

export interface CustomerModuleConfiguration {
  id: number;
  purchased_module_id: number;
  item_id: string;
  value?: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Servicio para manejar órdenes y módulos
export class OrderService {
  /**
   * Crear una nueva orden
   */
  static async createOrder(orderData: {
    customerId: string;
    customerInfo: any;
    selectedModules: string[];
    totalAmount: number;
    paymentMethod: string;
    paymentReference?: string;
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Generar IDs únicos
        const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const orderNumber = `ORD-${Date.now()}`;
        
        // Insertar orden
        const orderResult = await client.query(`
          INSERT INTO orders (
            id, customer_id, order_number, total_amount, 
            payment_method, payment_status, payment_reference, customer_info
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `, [
          orderId,
          orderData.customerId,
          orderNumber,
          orderData.totalAmount,
          orderData.paymentMethod,
          'completed',
          orderData.paymentReference || '',
          JSON.stringify(orderData.customerInfo)
        ]);
        
        const order = orderResult.rows[0];
        
        
        // Mapear IDs del configurador a IDs de la base de datos
        // SOLO usar módulos que existen en la BD
        const moduleIdMapping: Record<string, string> = {
          'appointments': 'module_appointment_scheduling',
          'appointment_scheduling': 'module_appointment_scheduling',
          
          'payments': 'module_whatsapp_payments',
          'whatsapp_payments': 'module_whatsapp_payments',
          
          'chatbot': 'module_chatbot_ai',
          'chatbot_ai': 'module_chatbot_ai',
          
          'analytics': 'module_analytics',
          
          'whatsapp': 'module_whatsapp_integration',
          'whatsapp_integration': 'module_whatsapp_integration',
          
          'email': 'module_email_marketing',
          'email_marketing': 'module_email_marketing',
          
          'billing': 'module_billing',
          
          'patients': 'module_patient_management',
          'patient_management': 'module_patient_management',
          
          'inventory': 'module_inventory_management',
          // NO incluir inventory_management porque no existe como módulo separado
        };
        
        // Filtrar módulos que existen y eliminar duplicados
        const validModuleIds = [
          'module_appointment_scheduling',
          'module_whatsapp_payments',
          'module_chatbot_ai', 
          'module_analytics',
          'module_whatsapp_integration',
          'module_email_marketing',
          'module_billing',
          'module_patient_management',
          'module_inventory_management'
        ];
        
        const mappedModules = orderData.selectedModules
          .map(moduleId => moduleIdMapping[moduleId] || moduleId)
          .filter(moduleId => validModuleIds.includes(moduleId));
        
        const uniqueModules = [...new Set(mappedModules)];
        
        // Insertar módulos comprados directamente sin verificar tabla modules
        for (const dbModuleId of uniqueModules) {
          
          const purchasedModuleResult = await client.query(`
            INSERT INTO purchased_modules (
              order_id, module_id, module_version, monthly_price, setup_price, status
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
          `, [
            orderId,
            dbModuleId,
            '1.0.0',
            50.00,
            0.00,
            'active'
          ]);
          
        }
        
        await client.query('COMMIT');
        
        return { success: true, order };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('[OrderService] Error creating order:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  /**
   * Guardar configuraciones de módulos
   */
  static async saveModuleConfigurations(userEmail: string, configurations: any): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Obtener la orden más reciente del usuario
        const ordersResult = await client.query(`
          SELECT id FROM orders 
          WHERE customer_id = $1 
          ORDER BY created_at DESC 
          LIMIT 1
        `, [userEmail]);
        
        if (ordersResult.rows.length === 0) {
          return { success: false, error: 'No se encontraron compras para este usuario' };
        }
        
        const orderId = ordersResult.rows[0].id;
        
        // Mapear IDs del configurador a IDs de la base de datos
        const configuratorToDbMapping: Record<string, string> = {
          'appointments': 'module_appointment_scheduling',
          'payments': 'module_whatsapp_payments',
          'chatbot': 'module_chatbot_ai',
          'analytics': 'module_analytics',
          'whatsapp': 'module_whatsapp_integration',
          'email': 'module_email_marketing',
          'billing': 'module_billing',
          'patients': 'module_patient_management',
          'inventory': 'module_inventory_management'
        };
        
        // Procesar cada módulo en las configuraciones
        for (const [moduleId, moduleData] of Object.entries(configurations)) {
          const dbModuleId = configuratorToDbMapping[moduleId] || moduleId;
          
          // Obtener el purchased_module_id
          const purchasedModuleResult = await client.query(`
            SELECT id FROM purchased_modules 
            WHERE order_id = $1 AND module_id = $2
          `, [orderId, dbModuleId]);
          
          if (purchasedModuleResult.rows.length === 0) {
            continue;
          }
          
          const purchasedModuleId = purchasedModuleResult.rows[0].id;
          
          // Guardar cada item del módulo
          const items = (moduleData as any).items || {};
          for (const [itemId, itemData] of Object.entries(items)) {
            const { value, completed } = itemData as any;
            
            // Hacer upsert de la configuración
            await client.query(`
              INSERT INTO customer_module_configurations 
              (purchased_module_id, item_id, value, is_completed, completed_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, NOW())
              ON CONFLICT (purchased_module_id, item_id)
              DO UPDATE SET
                value = EXCLUDED.value,
                is_completed = EXCLUDED.is_completed,
                completed_at = CASE 
                  WHEN EXCLUDED.is_completed = true AND customer_module_configurations.is_completed = false 
                  THEN NOW() 
                  WHEN EXCLUDED.is_completed = false 
                  THEN NULL 
                  ELSE customer_module_configurations.completed_at 
                END,
                updated_at = NOW()
            `, [
              purchasedModuleId,
              itemId,
              value || '',
              completed || false,
              completed ? new Date() : null
            ]);
          }
        }
        
        await client.query('COMMIT');
        
        return { success: true };
        
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  /**
   * Obtener compras de un usuario
   */
  static async getUserPurchases(userEmail: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const client = await pool.connect();
      
      try {
        // Obtener órdenes del usuario
        const ordersResult = await client.query(`
          SELECT * FROM orders 
          WHERE customer_id = $1 
          ORDER BY created_at DESC
        `, [userEmail]);
        
        if (ordersResult.rows.length === 0) {
          return { success: true, data: null };
        }
        
        const order = ordersResult.rows[0]; // Tomamos la orden más reciente
        
        // Mapear IDs de la base de datos de vuelta a IDs del configurador
        const dbToConfiguratorMapping: Record<string, string> = {
          'module_appointment_scheduling': 'appointments',
          'module_whatsapp_payments': 'payments',
          'module_chatbot_ai': 'chatbot',
          'module_analytics': 'analytics',
          'module_whatsapp_integration': 'whatsapp',
          'module_email_marketing': 'email',
          'module_billing': 'billing',
          'module_patient_management': 'patients',
          'module_inventory_management': 'inventory'
        };
        
        // Obtener módulos comprados
        const purchasedModulesResult = await client.query(`
          SELECT pm.*, m.name as module_name, m.description, m.category
          FROM purchased_modules pm
          JOIN modules m ON pm.module_id = m.id
          WHERE pm.order_id = $1
        `, [order.id]);
        
        // Obtener ítems de configuración para cada módulo
        const moduleConfigurations = [];
        
        for (const purchasedModule of purchasedModulesResult.rows) {
          
          const itemsResult = await client.query(`
            SELECT mi.*, cmc.value, cmc.is_completed
            FROM module_items mi
            LEFT JOIN customer_module_configurations cmc ON (
              mi.id = cmc.item_id AND 
              cmc.purchased_module_id = $1
            )
            WHERE mi.module_id = $2
            ORDER BY mi.sort_order
          `, [purchasedModule.id, purchasedModule.module_id]);
          
          const items = itemsResult.rows.map((item: any) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            value: item.value || item.default_value || '',
            completed: item.is_completed || false,
            required: item.is_required
          }));
          
          const completedItems = items.filter((item: any) => item.completed).length;
          const completionPercentage = items.length > 0 ? (completedItems / items.length) * 100 : 0;
          
          moduleConfigurations.push({
            moduleId: dbToConfiguratorMapping[purchasedModule.module_id] || purchasedModule.module_id,
            moduleName: purchasedModule.module_name,
            completionPercentage: Math.round(completionPercentage),
            items
          });
        }
        
        const customerInfo = typeof order.customer_info === 'string' 
          ? JSON.parse(order.customer_info) 
          : order.customer_info;
        
        const result = {
          customerInfo: {
            ...customerInfo,
            customerId: order.customer_id,
            modules: purchasedModulesResult.rows.map((pm: any) => 
              dbToConfiguratorMapping[pm.module_id] || pm.module_id
            ),
            totalPaid: order.total_amount,
            paymentDate: order.created_at
          },
          moduleConfigurations
        };
        
        return { success: true, data: result };
      } finally {
        client.release();
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }
}
