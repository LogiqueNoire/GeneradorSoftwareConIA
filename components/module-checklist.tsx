"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Key,
  Globe,
  Database,
  MessageSquare,
  CreditCard,
  Mail,
  Calendar,
  BarChart3,
  Users,
  ShoppingCart,
  Bot,
  Smartphone,
  FileText,
  Shield,
  Zap,
  Phone,
  Search,
  Gift,
  Headphones,
  TrendingUp,
  Eye,
  ExternalLink,
  Copy,
  Save
} from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  type: "input" | "checkbox" | "url" | "api_key" | "config"
  required: boolean
  completed: boolean
  value?: string
  placeholder?: string
  helpText?: string
  validationPattern?: string
}

interface ModuleChecklist {
  moduleId: string
  moduleName: string
  icon: any
  category: string
  items: ChecklistItem[]
}

interface ModuleChecklistProps {
  modules: string[]
  moduleConfigurations?: any[]
  onProgress?: (moduleId: string, progress: number) => void
  onChecklistUpdate?: (checklists: ModuleChecklist[]) => void
}

// Definición de checklists por módulo
const getModuleChecklist = (moduleId: string): ModuleChecklist | null => {
  const checklists: Record<string, ModuleChecklist> = {
    appointments: {
      moduleId: "appointments",
      moduleName: "Agendamiento de Citas",
      icon: Calendar,
      category: "core",
      items: [
        {
          id: "google_calendar_api",
          title: "API de Google Calendar",
          description: "Clave de API para sincronización con Google Calendar",
          type: "api_key",
          required: true,
          completed: false,
          placeholder: "AIzaSyD...",
          helpText: "Obtén tu API key desde Google Cloud Console"
        },
        {
          id: "calendar_id",
          title: "ID del Calendario",
          description: "ID del calendario principal donde se crearán las citas",
          type: "input",
          required: true,
          completed: false,
          placeholder: "primary o calendar-id@gmail.com"
        },
        {
          id: "booking_window",
          title: "Ventana de Reserva",
          description: "Cantidad de días hacia adelante para reservas",
          type: "input",
          required: true,
          completed: false,
          placeholder: "30"
        },
        {
          id: "appointment_types",
          title: "Tipos de Cita Configurados",
          description: "Tipos de citas disponibles",
          type: "config",
          required: true,
          completed: false,
          helpText: "Ej: Consulta General, Limpieza, Emergencia"
        }
      ]
    },
    payments: {
      moduleId: "payments",
      moduleName: "Pagos por WhatsApp",
      icon: CreditCard,
      category: "core",
      items: [
        {
          id: "whatsapp_business_token",
          title: "Token de WhatsApp Business",
          description: "Token de acceso para WhatsApp Business API",
          type: "api_key",
          required: true,
          completed: false,
          placeholder: "EAAl...",
          helpText: "Obtén el token desde Meta for Developers"
        },
        {
          id: "stripe_secret_key",
          title: "Clave Secreta de Stripe",
          description: "Clave secreta de Stripe (mantener segura)",
          type: "api_key",
          required: true,
          completed: false,
          placeholder: "sk_live_..."
        },
        {
          id: "payment_webhook_url",
          title: "URL del Webhook",
          description: "URL para recibir confirmaciones de pago",
          type: "url",
          required: true,
          completed: false,
          placeholder: "https://tu-dominio.com/api/webhook/stripe"
        },
        {
          id: "currency_config",
          title: "Moneda por Defecto",
          description: "Moneda utilizada en las transacciones",
          type: "input",
          required: false,
          completed: false,
          placeholder: "USD"
        }
      ]
    },
    chatbot: {
      moduleId: "chatbot",
      moduleName: "Chatbot IA",
      icon: Bot,
      category: "ai",
      items: [
        {
          id: "openai_api_key",
          title: "API Key de OpenAI",
          description: "Clave de API para GPT-4/GPT-3.5",
          type: "api_key",
          required: true,
          completed: false,
          placeholder: "sk-proj-...",
          helpText: "Obtén tu API key desde platform.openai.com"
        },
        {
          id: "response_language",
          title: "Idioma de Respuestas",
          description: "Idioma principal del chatbot",
          type: "input",
          required: false,
          completed: false,
          placeholder: "Español"
        },
        {
          id: "welcome_message",
          title: "Mensaje de Bienvenida",
          description: "Primer mensaje que muestra el chatbot",
          type: "input",
          required: true,
          completed: false,
          placeholder: "¡Hola! ¿En qué puedo ayudarte?"
        },
        {
          id: "ai_model",
          title: "Modelo de IA",
          description: "Modelo de OpenAI a utilizar",
          type: "input",
          required: false,
          completed: false,
          placeholder: "gpt-3.5-turbo"
        }
      ]
    },
    analytics: {
      moduleId: "analytics",
      moduleName: "Análisis de Sentimiento",
      icon: BarChart3,
      category: "ai",
      items: [
        {
          id: "google_analytics_id",
          title: "ID de Google Analytics",
          description: "ID de propiedad de Google Analytics 4",
          type: "input",
          required: true,
          completed: false,
          placeholder: "G-XXXXXXXXXX"
        },
        {
          id: "sentiment_api_key",
          title: "API de Análisis de Sentimiento",
          description: "Clave para Azure Cognitive Services o Google Cloud NLP",
          type: "api_key",
          required: true,
          completed: false,
          placeholder: "a1b2c3d4e5f6..."
        },
        {
          id: "report_frequency",
          title: "Frecuencia de Reportes",
          description: "Con qué frecuencia generar reportes automáticos",
          type: "input",
          required: true,
          completed: false,
          placeholder: "Diario, Semanal, Mensual"
        }
      ]
    },
    whatsapp: {
      moduleId: "whatsapp",
      moduleName: "Integración WhatsApp",
      icon: MessageSquare,
      category: "communication",
      items: [
        {
          id: "whatsapp_phone_number",
          title: "Número de WhatsApp Business",
          description: "Número de teléfono verificado en WhatsApp Business",
          type: "input",
          required: true,
          completed: false,
          placeholder: "+51987654321"
        },
        {
          id: "whatsapp_webhook_url",
          title: "URL del Webhook de WhatsApp",
          description: "URL para recibir mensajes de WhatsApp",
          type: "url",
          required: true,
          completed: false,
          placeholder: "https://tu-dominio.com/api/webhook/whatsapp"
        },
        {
          id: "auto_responses",
          title: "Respuestas Automáticas Configuradas",
          description: "Tipos de respuestas automáticas activas",
          type: "config",
          required: false,
          completed: false,
          helpText: "Configura: Saludos, Horarios, Ubicación"
        }
      ]
    },
    email: {
      moduleId: "email",
      moduleName: "Marketing por Email",
      icon: Mail,
      category: "marketing",
      items: [
        {
          id: "mailchimp_api_key",
          title: "Mailchimp API Key",
          description: "Clave de API de Mailchimp",
          type: "api_key",
          required: true,
          completed: false,
          placeholder: "abcd1234-us1"
        },
        {
          id: "sender_email",
          title: "Email del Remitente",
          description: "Dirección de email desde donde se enviarán las campañas",
          type: "input",
          required: true,
          completed: false,
          placeholder: "tu-email@gmail.com"
        },
        {
          id: "email_templates",
          title: "Plantillas Configuradas",
          description: "Plantillas de email disponibles",
          type: "config",
          required: false,
          completed: false,
          helpText: "Plantillas: Bienvenida, Recordatorio, Promociones"
        }
      ]
    },
    billing: {
      moduleId: "billing",
      moduleName: "Facturación Automática",
      icon: FileText,
      category: "finance",
      items: [
        {
          id: "sunat_api_key",
          title: "API Key de SUNAT",
          description: "Clave para integración con SUNAT (Perú)",
          type: "api_key",
          required: true,
          completed: false,
          placeholder: "sunat_key_123..."
        },
        {
          id: "company_ruc",
          title: "RUC de la Empresa",
          description: "Número de RUC de la empresa",
          type: "input",
          required: true,
          completed: false,
          placeholder: "12345678901"
        },
        {
          id: "billing_series",
          title: "Serie de Facturación",
          description: "Serie utilizada para las facturas",
          type: "input",
          required: true,
          completed: false,
          placeholder: "F001"
        },
        {
          id: "tax_rate",
          title: "Tasa de IGV",
          description: "Porcentaje de IGV aplicado",
          type: "input",
          required: false,
          completed: false,
          placeholder: "18"
        }
      ]
    },
    patients: {
      moduleId: "patients",
      moduleName: "Gestión de Pacientes",
      icon: Users,
      category: "healthcare",
      items: [
        {
          id: "database_connection",
          title: "Conexión a Base de Datos",
          description: "String de conexión a la base de datos de pacientes",
          type: "api_key",
          required: true,
          completed: false,
          placeholder: "postgresql://user:pass@host:5432/dbname"
        },
        {
          id: "patient_fields",
          title: "Campos de Paciente Configurados",
          description: "Campos disponibles en el registro de pacientes",
          type: "config",
          required: true,
          completed: false,
          helpText: "Campos: Nombre, DNI, Teléfono, Email, Historial"
        },
        {
          id: "backup_frequency",
          title: "Frecuencia de Backup",
          description: "Con qué frecuencia hacer respaldo de datos",
          type: "input",
          required: false,
          completed: false,
          placeholder: "Diario"
        },
        {
          id: "patient_portal_url",
          title: "URL del Portal de Pacientes",
          description: "URL donde los pacientes pueden acceder a su información",
          type: "url",
          required: false,
          completed: false,
          placeholder: "https://portal-pacientes.com"
        }
      ]
    },
    inventory: {
      moduleId: "inventory",
      moduleName: "Gestión de Inventario",
      icon: ShoppingCart,
      category: "business",
      items: [
        {
          id: "inventory_database_url",
          title: "URL de Base de Datos de Inventario",
          description: "Conexión a la base de datos de inventario",
          type: "api_key",
          required: true,
          completed: false,
          placeholder: "postgresql://user:pass@host:5432/inventory"
        },
        {
          id: "low_stock_threshold",
          title: "Umbral de Stock Bajo",
          description: "Cantidad mínima para alertas de stock",
          type: "input",
          required: false,
          completed: false,
          placeholder: "10"
        },
        {
          id: "barcode_scanner_api",
          title: "API de Escáner de Códigos",
          description: "API para integración con escáneres de códigos de barras",
          type: "api_key",
          required: false,
          completed: false,
          placeholder: "barcode_api_key_123"
        },
        {
          id: "inventory_categories",
          title: "Categorías de Inventario Configuradas",
          description: "Categorías para organizar productos",
          type: "config",
          required: true,
          completed: false,
          helpText: "Ej: Medicamentos, Equipos, Suministros, Consumibles"
        }
      ]
    }
  }

  return checklists[moduleId] || null
}

export function ModuleChecklist({ modules, moduleConfigurations, onProgress, onChecklistUpdate }: ModuleChecklistProps) {
  const [checklists, setChecklists] = useState<ModuleChecklist[]>([])
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  useEffect(() => {
    const loadModuleConfigurations = async () => {
      const moduleChecklists = modules
        .map(moduleId => getModuleChecklist(moduleId))
        .filter(Boolean) as ModuleChecklist[]
      
      // Intentar cargar configuraciones desde el servidor primero
      try {
        const response = await fetch('/api/module-configurations/load')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.configurations) {
            
            // Aplicar configuraciones del servidor
            const checklistsWithServerData = moduleChecklists.map(checklist => ({
              ...checklist,
              items: checklist.items.map(item => {
                const serverConfig = result.configurations[checklist.moduleId]?.items?.[item.id]
                if (serverConfig) {
                  return { ...item, ...serverConfig }
                }
                return item
              })
            }))
            
            setChecklists(checklistsWithServerData)
            
            // También guardar en localStorage como respaldo
            checklistsWithServerData.forEach(checklist => {
              checklist.items.forEach(item => {
                if (item.value || item.completed) {
                  const storageKey = `module_config_${checklist.moduleId}_${item.id}`
                  localStorage.setItem(storageKey, JSON.stringify({ 
                    value: item.value, 
                    completed: item.completed 
                  }))
                }
              })
            })
            
            if (onChecklistUpdate) {
              onChecklistUpdate(checklistsWithServerData)
            }
            return
          }
        }
      } catch (error) {
        console.error('[ModuleChecklist] Error loading server configurations:', error)
      }
      
      // Fallback: cargar desde localStorage si el servidor falla
      const checklistsWithSavedData = moduleChecklists.map(checklist => ({
        ...checklist,
        items: checklist.items.map(item => {
          const storageKey = `module_config_${checklist.moduleId}_${item.id}`
          const savedData = localStorage.getItem(storageKey)
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData)
              return { ...item, ...parsedData }
            } catch (error) {
              console.error('Error parsing saved data:', error)
              return item
            }
          }
          return item
        })
      }))
      
      setChecklists(checklistsWithSavedData)
      if (checklistsWithSavedData.length > 0 && !expandedModule) {
        setExpandedModule(checklistsWithSavedData[0].moduleId)
      }

      if (onChecklistUpdate) {
        onChecklistUpdate(checklistsWithSavedData)
      }
    }

    loadModuleConfigurations()
  }, [modules, expandedModule])

  const updateChecklistItem = async (moduleId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    // Actualizar el estado local inmediatamente
    setChecklists(prev => 
      prev.map(checklist => 
        checklist.moduleId === moduleId
          ? {
              ...checklist,
              items: checklist.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              )
            }
          : checklist
      )
    )

    // Guardar en localStorage para persistencia local
    const storageKey = `module_config_${moduleId}_${itemId}`
    localStorage.setItem(storageKey, JSON.stringify(updates))

    // Guardar automáticamente en el servidor
    try {
      // Crear estructura de configuraciones completa para enviar al servidor
      const moduleConfig = checklists.find(c => c.moduleId === moduleId)
      if (moduleConfig) {
        const configurationData: any = {}
        
        // Actualizar la configuración con los nuevos datos
        moduleConfig.items.forEach(item => {
          if (item.id === itemId) {
            configurationData[item.id] = { ...updates }
          } else if (item.value || item.completed) {
            configurationData[item.id] = { 
              value: item.value, 
              completed: item.completed 
            }
          }
        })

        const configurations = {
          [moduleId]: {
            items: configurationData
          }
        }

        const response = await fetch('/api/module-configurations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ configurations })
        })

        if (!response.ok) {
          // Si falla el servidor, al menos tenemos localStorage como respaldo
        } else {
          // Guardado exitoso
        }
      }
    } catch (error) {
      console.error('[ModuleChecklist] Error auto-saving to server:', error)
      // Si falla el servidor, al menos tenemos localStorage como respaldo
    }

    // Calcular progreso
    const moduleChecklist = checklists.find(c => c.moduleId === moduleId)
    if (moduleChecklist && onProgress) {
      const updatedItems = moduleChecklist.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
      const completed = updatedItems.filter(item => item.completed).length
      const total = updatedItems.length
      const progress = (completed / total) * 100
      onProgress(moduleId, progress)
    }
  }

  const getModuleProgress = (checklist: ModuleChecklist) => {
    const completed = checklist.items.filter(item => item.completed).length
    const total = checklist.items.length
    return { completed, total, percentage: (completed / total) * 100 }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const saveToServer = async () => {
    try {
      // Crear estructura completa de configuraciones para enviar al servidor
      const configurations: any = {}
      
      checklists.forEach(checklist => {
        const moduleItems: any = {}
        checklist.items.forEach(item => {
          if (item.value || item.completed) {
            moduleItems[item.id] = {
              value: item.value || '',
              completed: item.completed
            }
          }
        })
        
        if (Object.keys(moduleItems).length > 0) {
          configurations[checklist.moduleId] = {
            items: moduleItems
          }
        }
      })

      const response = await fetch('/api/module-configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configurations })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          alert('✅ Configuración guardada correctamente')
        } else {
          throw new Error(result.error || 'Error desconocido')
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
    } catch (error) {
      console.error('[ModuleChecklist] Error in manual sync:', error)
      alert(`❌ Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  const renderInput = (moduleId: string, item: ChecklistItem) => {
    const handleChange = (value: string) => {
      updateChecklistItem(moduleId, item.id, { 
        value, 
        completed: item.type === 'checkbox' ? !item.completed : value.length > 0 
      })
    }

    const handleCheckboxChange = (checked: boolean) => {
      updateChecklistItem(moduleId, item.id, { completed: checked })
    }

    switch (item.type) {
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={item.id}
              checked={item.completed}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor={item.id} className="text-sm">
              {item.description}
            </Label>
          </div>
        )
      
      case 'api_key':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder={item.placeholder}
                value={item.value || ""}
                onChange={(e) => handleChange(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(item.value || "")}
                disabled={!item.value}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {item.helpText && (
              <p className="text-xs text-muted-foreground">{item.helpText}</p>
            )}
          </div>
        )
      
      case 'config':
        return (
          <div className="space-y-2">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              {item.helpText && (
                <p className="text-xs text-muted-foreground mt-1">{item.helpText}</p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateChecklistItem(moduleId, item.id, { completed: !item.completed })}
            >
              {item.completed ? "Configurado" : "Marcar como Configurado"}
            </Button>
          </div>
        )
      
      default:
        return (
          <div className="space-y-2">
            <Input
              placeholder={item.placeholder}
              value={item.value || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
            {item.helpText && (
              <p className="text-xs text-muted-foreground">{item.helpText}</p>
            )}
          </div>
        )
    }
  }

  if (checklists.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay módulos para configurar</h3>
          <p className="text-muted-foreground">
            Selecciona algunos módulos para ver sus checklists de configuración.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Botón de guardar configuración */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Configuración de Módulos</h3>
          <p className="text-sm text-muted-foreground">
            Los datos se guardan automáticamente en el servidor mientras escribes
          </p>
        </div>
        <Button 
          onClick={saveToServer}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar
        </Button>
      </div>
      
      <div className="grid gap-4">
        {checklists.map((checklist) => {
          const progress = getModuleProgress(checklist)
          const Icon = checklist.icon
          const isExpanded = expandedModule === checklist.moduleId

          return (
            <Card key={checklist.moduleId} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedModule(isExpanded ? null : checklist.moduleId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{checklist.moduleName}</CardTitle>
                      <CardDescription>
                        {progress.completed} de {progress.total} tareas completadas
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={progress.percentage === 100 ? "default" : "secondary"}
                      className="px-3"
                    >
                      {Math.round(progress.percentage)}%
                    </Badge>
                    {progress.percentage === 100 && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
                
                {/* Barra de progreso */}
                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {checklist.items.map((item, index) => (
                      <div key={item.id} className="space-y-3">
                        {index > 0 && <Separator />}
                        
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {item.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : item.required ? (
                              <AlertCircle className="w-5 h-5 text-orange-500" />
                            ) : (
                              <Clock className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Label className="font-medium">{item.title}</Label>
                                {item.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Requerido
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                            
                            {renderInput(checklist.moduleId, item)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}