import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export interface Module {
  id: string
  name: string
  description: string
  category: string
  monthly_price: number
  setup_price: number
  version: string
  is_active: boolean
}

export interface ModuleItem {
  id: string
  module_id: string
  title: string
  description: string
  type: 'api_key' | 'input' | 'url' | 'config'
  is_required: boolean
  default_value: string
  placeholder_text?: string
  sort_order: number
}

export interface Order {
  id: string
  customer_id: string
  order_number: string
  total_amount: number
  payment_method: 'stripe' | 'paypal'
  payment_status: 'pending' | 'completed' | 'failed'
  payment_reference?: string
  customer_info: any
}

export interface PurchasedModule {
  id: number
  order_id: string
  module_id: string
  module_version: string
  monthly_price: number
  setup_price: number
  status: 'active' | 'suspended' | 'cancelled'
  module?: Module
}

export class ModulesService {
  
  /**
   * Obtener todos los módulos activos
   */
  static async getActiveModules(): Promise<Module[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT * FROM modules 
        WHERE is_active = true 
        ORDER BY category, name
      `)
      return result.rows
    } finally {
      client.release()
    }
  }

  /**
   * Obtener módulos por categoría
   */
  static async getModulesByCategory(category: string): Promise<Module[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT * FROM modules 
        WHERE is_active = true AND category = $1 
        ORDER BY name
      `, [category])
      return result.rows
    } finally {
      client.release()
    }
  }

  /**
   * Obtener ítems de un módulo
   */
  static async getModuleItems(moduleId: string): Promise<ModuleItem[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT * FROM module_items 
        WHERE module_id = $1 
        ORDER BY sort_order, title
      `, [moduleId])
      return result.rows
    } finally {
      client.release()
    }
  }

  /**
   * Crear una nueva orden
   */
  static async createOrder(orderData: {
    customer_id: string
    total_amount: number
    payment_method: 'stripe' | 'paypal'
    customer_info: any
    modules: string[]
  }): Promise<string> {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Generar número de orden único
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Crear orden
      await client.query(`
        INSERT INTO orders (id, customer_id, order_number, total_amount, payment_method, customer_info)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [orderId, orderData.customer_id, orderNumber, orderData.total_amount, orderData.payment_method, JSON.stringify(orderData.customer_info)])

      // Obtener información de módulos
      const modulesResult = await client.query(`
        SELECT * FROM modules WHERE id = ANY($1)
      `, [orderData.modules])

      // Crear registros de módulos comprados
      for (const module of modulesResult.rows) {
        await client.query(`
          INSERT INTO purchased_modules (order_id, module_id, module_version, monthly_price, setup_price)
          VALUES ($1, $2, $3, $4, $5)
        `, [orderId, module.id, module.version, module.monthly_price, module.setup_price])
      }

      await client.query('COMMIT')
      return orderId
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Actualizar estado de pago de una orden
   */
  static async updateOrderPaymentStatus(orderId: string, status: 'completed' | 'failed', paymentReference?: string): Promise<void> {
    const client = await pool.connect()
    try {
      await client.query(`
        UPDATE orders 
        SET payment_status = $2, payment_reference = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [orderId, status, paymentReference])
    } finally {
      client.release()
    }
  }

  /**
   * Obtener módulos comprados por cliente
   */
  static async getPurchasedModulesByCustomer(customerId: string): Promise<PurchasedModule[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT pm.*, m.name, m.description, m.category
        FROM purchased_modules pm
        JOIN orders o ON pm.order_id = o.id
        JOIN modules m ON pm.module_id = m.id
        WHERE o.customer_id = $1 AND o.payment_status = 'completed' AND pm.status = 'active'
        ORDER BY pm.purchase_date DESC
      `, [customerId])
      
      return result.rows.map(row => ({
        id: row.id,
        order_id: row.order_id,
        module_id: row.module_id,
        module_version: row.module_version,
        monthly_price: parseFloat(row.monthly_price),
        setup_price: parseFloat(row.setup_price),
        status: row.status,
        module: {
          id: row.module_id,
          name: row.name,
          description: row.description,
          category: row.category,
          monthly_price: parseFloat(row.monthly_price),
          setup_price: parseFloat(row.setup_price),
          version: row.module_version,
          is_active: true
        }
      }))
    } finally {
      client.release()
    }
  }

  /**
   * Guardar configuración de cliente para un módulo
   */
  static async saveCustomerModuleConfiguration(purchasedModuleId: number, itemConfigurations: { item_id: string, value: string, is_completed: boolean }[]): Promise<void> {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      for (const config of itemConfigurations) {
        await client.query(`
          INSERT INTO customer_module_configurations (purchased_module_id, item_id, value, is_completed, completed_at)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (purchased_module_id, item_id) 
          DO UPDATE SET 
            value = EXCLUDED.value,
            is_completed = EXCLUDED.is_completed,
            completed_at = EXCLUDED.completed_at,
            updated_at = CURRENT_TIMESTAMP
        `, [
          purchasedModuleId, 
          config.item_id, 
          config.value, 
          config.is_completed,
          config.is_completed ? new Date() : null
        ])
      }

      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Obtener configuraciones de cliente para sus módulos
   */
  static async getCustomerModuleConfigurations(customerId: string): Promise<any[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT 
          pm.id as purchased_module_id,
          pm.module_id,
          m.name as module_name,
          mi.id as item_id,
          mi.title as item_title,
          mi.type as item_type,
          mi.is_required as item_required,
          COALESCE(cmc.value, mi.default_value) as value,
          COALESCE(cmc.is_completed, false) as completed
        FROM purchased_modules pm
        JOIN orders o ON pm.order_id = o.id
        JOIN modules m ON pm.module_id = m.id
        JOIN module_items mi ON m.id = mi.module_id
        LEFT JOIN customer_module_configurations cmc ON pm.id = cmc.purchased_module_id AND mi.id = cmc.item_id
        WHERE o.customer_id = $1 AND o.payment_status = 'completed' AND pm.status = 'active'
        ORDER BY pm.module_id, mi.sort_order
      `, [customerId])

      // Agrupar por módulo
      const moduleConfigs: any = {}
      for (const row of result.rows) {
        if (!moduleConfigs[row.module_id]) {
          moduleConfigs[row.module_id] = {
            moduleId: row.module_id,
            moduleName: row.module_name,
            items: []
          }
        }
        
        moduleConfigs[row.module_id].items.push({
          id: row.item_id,
          title: row.item_title,
          type: row.item_type,
          value: row.value || '',
          completed: row.completed,
          required: row.item_required
        })
      }

      return Object.values(moduleConfigs)
    } finally {
      client.release()
    }
  }
}