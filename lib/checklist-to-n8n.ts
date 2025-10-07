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
  customerId?: string
  companyName?: string
  email?: string
  firstName?: string
  lastName?: string
  template?: string
  modules?: string[]
  totalPaid?: number
  paymentDate?: string
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
   * Envía los datos del checklist completado a n8n para procesamiento
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

      console.log('[ChecklistToN8n] Enviando datos a n8n:', payload)

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
      
      console.log('[ChecklistToN8n] Respuesta de n8n:', result)

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
  private static getCustomerInfoFromStorage(): CustomerInfo {
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
   * Inicia el proceso de deployment enviando datos a n8n
   */
  static async initiateDeployment(
    checklists: any[],
    moduleProgress: Record<string, number>
  ): Promise<{
    success: boolean
    deploymentId?: string
    orderId?: string
    error?: string
    warnings?: string[]
  }> {
    // Transformar datos
    const checklistData = this.transformChecklistData(checklists, moduleProgress)
    
    // Validar
    const validation = this.validateForDeployment(checklistData)
    
    if (!validation.valid) {
      return {
        success: false,
        error: `Faltan configuraciones requeridas: ${validation.errors.join('; ')}`
      }
    }

    // Enviar a n8n
    const result = await this.sendChecklistToN8n(checklistData)
    
    return {
      ...result,
      warnings: validation.warnings
    }
  }
}

// Hook para usar el servicio en componentes React
export function useChecklistDeployment() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<any>(null)

  const startDeployment = async (
    checklists: any[],
    moduleProgress: Record<string, number>
  ) => {
    setIsDeploying(true)
    setDeploymentResult(null)

    try {
      const result = await ChecklistToN8nService.initiateDeployment(checklists, moduleProgress)
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