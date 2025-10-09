import { useState } from 'react'

// Servicio para enviar datos del checklist a n8n
export interface ChecklistData {
  moduleId: string
  moduleName: string
  items: ChecklistItemData[]
  completionPercentage: number
}

export interface ChecklistItemData {
  id: string
  title: string
  type: string
  value?: string
  completed: boolean
  required: boolean
}

export interface CustomerInfo {
  customerId: string
  companyName?: string
  email: string
  firstName?: string
  lastName?: string
  template?: string
  modules: string[]
  totalPaid: number
  paymentDate: string
}

export interface N8nPayload {
  customerInfo: CustomerInfo
  moduleConfigurations: ChecklistData[]
  timestamp: string
  deploymentTrigger: boolean
}

export class ChecklistToN8nService {
  private static N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/c11bd2cd-ad24-403f-8718-571562b90fd1'
  
  /**
   * Obtiene los datos completos del usuario (compras + configuraciones) y los envía a N8N
   */
  static async sendCompleteUserDataToN8n(): Promise<{
    success: boolean
    deploymentId?: string
    orderId?: string
    error?: string
  }> {
    try {
      
      // 1. Obtener perfil completo del usuario desde la tabla users
      const userResponse = await fetch('/api/user/profile')
      if (!userResponse.ok) {
        throw new Error(`Error obteniendo perfil de usuario: ${userResponse.status}`)
      }
      
      const userResult = await userResponse.json()
      if (!userResult.success || !userResult.user) {
        throw new Error('No se encontró el perfil del usuario')
      }

      const userProfile = userResult.user

      // 2. Obtener datos de compras del usuario
      const purchasesResponse = await fetch('/api/user/purchases')
      if (!purchasesResponse.ok) {
        throw new Error(`Error obteniendo compras: ${purchasesResponse.status}`)
      }
      
      const purchasesResult = await purchasesResponse.json()
      if (!purchasesResult.success || !purchasesResult.data) {
        throw new Error('No se encontraron compras del usuario')
      }

      // 3. Obtener configuraciones de módulos guardadas
      const configResponse = await fetch('/api/module-configurations/load')
      let savedConfigurations: any = {}
      
      if (configResponse.ok) {
        const configResult = await configResponse.json()
        if (configResult.success) {
          savedConfigurations = configResult.configurations
        }
      }

      // 4. Preparar datos en el formato que necesita N8N
      const userData = purchasesResult.data
      
      // Transformar las configuraciones al formato correcto
      const moduleConfigurations = userData.moduleConfigurations.map((module: any) => {
        // Usar configuraciones guardadas o las que vienen de la API
        const savedModuleConfig = savedConfigurations[module.moduleId]?.items || {}
        
        // Combinar datos de la BD con configuraciones guardadas
        const items = module.items.map((item: any) => {
          const savedItem = savedModuleConfig[item.id]
          return {
            id: item.id,
            title: item.title,
            type: item.type,
            value: savedItem?.value || item.value || "",
            completed: savedItem?.completed || item.completed || false,
            required: item.required
          }
        })

        // Calcular porcentaje de completación actualizado
        const completedItems = items.filter((item: any) => item.completed).length
        const completionPercentage = items.length > 0 ? (completedItems / items.length) * 100 : 0

        return {
          moduleId: module.moduleId,
          moduleName: module.moduleName,
          completionPercentage: Math.round(completionPercentage),
          items
        }
      })

      // 5. Preparar payload completo para N8N usando datos reales del usuario
      const payload: N8nPayload = {
        customerInfo: {
          customerId: userProfile.id || `CUST-${Date.now()}`,
          companyName: userProfile.company || userData.customerInfo.companyName || "Empresa Sin Nombre",
          email: userProfile.email,
          firstName: userProfile.given_name || userData.customerInfo.firstName || "Usuario",
          lastName: userProfile.family_name || userData.customerInfo.lastName || "Sin Apellido",
          template: userData.customerInfo.template || "default_template",
          modules: userData.customerInfo.modules || [],
          totalPaid: userData.customerInfo.totalPaid || 0,
          paymentDate: userData.customerInfo.paymentDate || new Date().toISOString().split('T')[0]
        },
        moduleConfigurations,
        timestamp: new Date().toISOString(),
        deploymentTrigger: true
      }

      // 6. Enviar a N8N
      const response = await fetch(this.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Error en N8N: ${response.status} - ${response.statusText}`)
      }

      let result: any = {}
      try {
        result = await response.json()
      } catch (e) {
        // N8N puede devolver texto plano, no JSON
        result = { message: 'Webhook enviado correctamente' }
      }
      
      return {
        success: true,
        deploymentId: result.deploymentId || `DEPLOY-${Date.now()}`,
        orderId: result.orderId || userProfile.id
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Envía los datos del checklist completado a n8n para procesamiento
   * @deprecated Usar sendCompleteUserDataToN8n() en su lugar
   */
  static async sendChecklistToN8n(
    moduleConfigurations: ChecklistData[],
    customerInfo?: CustomerInfo
  ): Promise<{
    success: boolean
    deploymentId?: string
    orderId?: string
    error?: string
  }> {
    try {
      // Preparar payload para n8n
      const payload: N8nPayload = {
        customerInfo: customerInfo || this.getCustomerInfoFromStorage(),
        moduleConfigurations,
        timestamp: new Date().toISOString(),
        deploymentTrigger: true
      }

      // Enviar a n8n (sin API key ya que no la necesitas)
      const response = await fetch(this.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Error en n8n: ${response.status} - ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        deploymentId: result.deploymentId,
        orderId: result.orderId
      }

    } catch (error) {
      console.error('[ChecklistToN8n] Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene información del cliente desde localStorage
   */
  private static getCustomerInfoFromStorage(): any {
    if (typeof window === 'undefined') return {}

    try {
      const customerData = localStorage.getItem("customerData")
      if (customerData) {
        return JSON.parse(customerData)
      }
    } catch (error) {
      console.error('[ChecklistToN8n] Error leyendo customerData:', error)
    }

    return {}
  }

  /**
   * Transforma datos del checklist al formato esperado por n8n
   */
  static transformChecklistData(
    checklists: any[],
    moduleProgress: Record<string, number>
  ): ChecklistData[] {
    return checklists.map(checklist => ({
      moduleId: checklist.moduleId,
      moduleName: checklist.moduleName,
      completionPercentage: moduleProgress[checklist.moduleId] || 0,
      items: checklist.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        value: item.value,
        completed: item.completed,
        required: item.required
      }))
    }))
  }

  /**
   * Valida que los módulos requeridos estén completos antes del deployment
   */
  static validateForDeployment(checklists: ChecklistData[]): {
    valid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    checklists.forEach(checklist => {
      const requiredItems = checklist.items.filter(item => item.required)
      const completedRequired = requiredItems.filter(item => item.completed)

      // Verificar campos requeridos
      if (completedRequired.length < requiredItems.length) {
        const missingItems = requiredItems
          .filter(item => !item.completed)
          .map(item => item.title)
        
        errors.push(`${checklist.moduleName}: Faltan campos requeridos: ${missingItems.join(', ')}`)
      }

      // Verificar progreso mínimo
      if (checklist.completionPercentage < 70) {
        warnings.push(`${checklist.moduleName}: Configuración incompleta (${checklist.completionPercentage}%)`)
      }
    })

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Inicia el proceso de deployment enviando datos completos a N8N
   */
  static async initiateDeployment(): Promise<{
    success: boolean
    deploymentId?: string
    orderId?: string
    error?: string
    warnings?: string[]
  }> {
    // Enviar datos completos directamente a N8N
    const result = await this.sendCompleteUserDataToN8n()
    
    return {
      ...result,
      warnings: []
    }
  }
}

// Hook para usar el servicio en componentes React
export function useChecklistDeployment() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<any>(null)

  const startDeployment = async () => {
    setIsDeploying(true)
    setDeploymentResult(null)

    try {
      const result = await ChecklistToN8nService.initiateDeployment()
      setDeploymentResult(result)
      return result
    } finally {
      setIsDeploying(false)
    }
  }

  return {
    startDeployment,
    isDeploying,
    deploymentResult
  }
}