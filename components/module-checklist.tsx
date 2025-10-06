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
          completed: true,
          placeholder: "AIzaSyD...",
          helpText: "Obtén tu API key desde Google Cloud Console",
          value: "AIzaSyDXX1234567890abcdefghijklmnopqrstuvwxyz"
        },
        {
          id: "calendar_id",
          title: "ID del Calendario",
          description: "ID del calendario principal donde se crearán las citas",
          type: "input",
          required: true,
          completed: true,
          placeholder: "primary o calendar-id@gmail.com",
          value: "primary"
        },
        {
          id: "time_zone",
          title: "Zona Horaria",
          description: "Zona horaria para las citas",
          type: "input",
          required: true,
          completed: true,
          placeholder: "America/Lima",
          value: "America/Lima"
        },
        {
          id: "notification_settings",
          title: "Configurar Notificaciones",
          description: "Habilitar recordatorios automáticos",
          type: "checkbox",
          required: false,
          completed: true
        },
        {
          id: "business_hours",
          title: "Horarios de Atención",
          description: "Configurar horarios disponibles para citas",
          type: "config",
          required: true,
          completed: true,
          helpText: "Lunes a Viernes: 9:00 AM - 6:00 PM"
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
          id: "whatsapp_token",
          title: "Token de WhatsApp Business",
          description: "Token de acceso para WhatsApp Business API",
          type: "api_key",
          required: true,
          completed: true,
          placeholder: "EAAl...",
          helpText: "Obtén el token desde Meta for Developers",
          value: "EAAl1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk"
        },
        {
          id: "phone_number_id",
          title: "ID del Número de Teléfono",
          description: "ID del número de WhatsApp Business verificado",
          type: "input",
          required: true,
          completed: true,
          placeholder: "1234567890123456",
          value: "1234567890123456"
        },
        {
          id: "stripe_public_key",
          title: "Clave Pública de Stripe",
          description: "Clave pública para procesar pagos",
          type: "api_key",
          required: true,
          completed: true,
          placeholder: "pk_live_...",
          value: "pk_live_1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef"
        },
        {
          id: "stripe_secret_key",
          title: "Clave Secreta de Stripe",
          description: "Clave secreta de Stripe (mantener segura)",
          type: "api_key",
          required: true,
          completed: true,
          placeholder: "sk_live_...",
          value: "sk_live_1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef"
        },
        {
          id: "webhook_url",
          title: "URL del Webhook",
          description: "URL para recibir confirmaciones de pago",
          type: "url",
          required: true,
          completed: true,
          placeholder: "https://tu-dominio.com/api/webhook/stripe",
          value: "https://misistema.com/api/webhook/stripe"
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
          completed: true,
          placeholder: "sk-proj-...",
          helpText: "Obtén tu API key desde platform.openai.com",
          value: "sk-proj-1234567890abcdefghijklmnopqrstuvwxyzABCDEF"
        },
        {
          id: "assistant_id",
          title: "ID del Asistente",
          description: "ID del asistente personalizado (opcional)",
          type: "input",
          required: false,
          completed: true,
          placeholder: "asst_...",
          value: "asst_ABC123DEF456GHI789JKL012MNO345"
        },
        {
          id: "training_data",
          title: "Datos de Entrenamiento",
          description: "URL o archivo con información específica de tu negocio",
          type: "url",
          required: false,
          completed: true,
          placeholder: "https://tu-sitio.com/knowledge-base.txt",
          value: "https://misistema.com/knowledge-base.txt"
        },
        {
          id: "response_language",
          title: "Idioma de Respuestas",
          description: "Idioma principal para las respuestas del bot",
          type: "input",
          required: true,
          completed: true,
          placeholder: "español",
          value: "español"
        },
        {
          id: "enable_voice",
          title: "Habilitar Respuestas de Voz",
          description: "Permitir que el bot responda con audio",
          type: "checkbox",
          required: false,
          completed: true
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
          completed: true,
          placeholder: "G-XXXXXXXXXX",
          value: "G-ABC1234567"
        },
        {
          id: "sentiment_api_key",
          title: "API de Análisis de Sentimiento",
          description: "Clave para Azure Cognitive Services o Google Cloud NLP",
          type: "api_key",
          required: true,
          completed: true,
          placeholder: "a1b2c3d4e5f6...",
          value: "a1b2c3d4e5f6789012345678901234567890abcdef"
        },
        {
          id: "data_sources",
          title: "Fuentes de Datos",
          description: "Configurar fuentes de feedback (formularios, reseñas, etc.)",
          type: "config",
          required: true,
          completed: true,
          helpText: "Configurado: WhatsApp Business, Formularios web, Google Reviews, Email feedback"
        },
        {
          id: "reporting_frequency",
          title: "Frecuencia de Reportes",
          description: "Con qué frecuencia generar reportes automáticos",
          type: "input",
          required: true,
          completed: true,
          placeholder: "Diario, Semanal, Mensual",
          value: "Semanal"
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
          id: "whatsapp_business_token",
          title: "Token de WhatsApp Business",
          description: "Token de acceso a la API de WhatsApp Business",
          type: "api_key",
          required: true,
          completed: true,
          placeholder: "EAAl...",
          value: "EAAl9876543210ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvu"
        },
        {
          id: "verify_token",
          title: "Token de Verificación",
          description: "Token para verificar webhooks",
          type: "input",
          required: true,
          completed: true,
          placeholder: "mi_token_secreto_123",
          value: "webhook_verify_token_2024"
        },
        {
          id: "phone_number",
          title: "Número de Teléfono",
          description: "Número de WhatsApp Business verificado",
          type: "input",
          required: true,
          completed: true,
          placeholder: "+51987654321",
          value: "+51987654321"
        },
        {
          id: "webhook_url_whatsapp",
          title: "URL del Webhook",
          description: "URL para recibir mensajes de WhatsApp",
          type: "url",
          required: true,
          completed: true,
          placeholder: "https://tu-dominio.com/api/webhook/whatsapp",
          value: "https://misistema.com/api/webhook/whatsapp"
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
          id: "smtp_host",
          title: "Servidor SMTP",
          description: "Servidor SMTP para envío de emails",
          type: "input",
          required: true,
          completed: true,
          placeholder: "smtp.gmail.com",
          value: "smtp.gmail.com"
        },
        {
          id: "smtp_port",
          title: "Puerto SMTP",
          description: "Puerto del servidor SMTP",
          type: "input",
          required: true,
          completed: true,
          placeholder: "587",
          value: "587"
        },
        {
          id: "email_username",
          title: "Usuario de Email",
          description: "Usuario para autenticación SMTP",
          type: "input",
          required: true,
          completed: true,
          placeholder: "tu-email@gmail.com",
          value: "sistema@tuempresa.com"
        },
        {
          id: "email_password",
          title: "Contraseña de Aplicación",
          description: "Contraseña específica de aplicación",
          type: "api_key",
          required: true,
          completed: true,
          placeholder: "abcd efgh ijkl mnop",
          value: "wxyz 1234 abcd 5678"
        },
        {
          id: "sender_name",
          title: "Nombre del Remitente",
          description: "Nombre que aparecerá en los emails",
          type: "input",
          required: true,
          completed: true,
          placeholder: "Tu Empresa",
          value: "Sistema de Gestión"
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
          id: "tax_api_key",
          title: "API de Cálculo de Impuestos",
          description: "Clave para servicio de cálculo automático de impuestos",
          type: "api_key",
          required: false,
          completed: true,
          placeholder: "tax_live_...",
          value: "tax_live_ABC123DEF456GHI789JKL012MNO345PQR678"
        },
        {
          id: "invoice_template",
          title: "Plantilla de Factura",
          description: "URL de la plantilla personalizada de facturas",
          type: "url",
          required: false,
          completed: true,
          placeholder: "https://tu-dominio.com/templates/invoice.html",
          value: "https://misistema.com/templates/factura-empresarial.html"
        },
        {
          id: "company_info",
          title: "Información de la Empresa",
          description: "Datos fiscales de tu empresa",
          type: "config",
          required: true,
          completed: true,
          helpText: "RUC: 12345678901, Razón Social: Tu Empresa S.A.C., Dirección: Av. Principal 123"
        },
        {
          id: "auto_send",
          title: "Envío Automático",
          description: "Enviar facturas automáticamente por email",
          type: "checkbox",
          required: false,
          completed: true
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
          id: "hl7_integration",
          title: "Integración HL7",
          description: "URL del servidor HL7 para intercambio de datos médicos",
          type: "url",
          required: false,
          completed: true,
          placeholder: "https://hl7-server.com/api",
          value: "https://hl7-mexico.com/api/v2/fhir"
        },
        {
          id: "medical_record_format",
          title: "Formato de Historia Clínica",
          description: "Configurar campos personalizados para historias clínicas",
          type: "config",
          required: true,
          completed: true,
          helpText: "Campos configurados: Alergias, Medicamentos actuales, Antecedentes familiares, Diagnósticos previos"
        },
        {
          id: "gdpr_compliance",
          title: "Cumplimiento GDPR",
          description: "Habilitar funciones de protección de datos",
          type: "checkbox",
          required: true,
          completed: true
        },
        {
          id: "backup_frequency",
          title: "Frecuencia de Respaldo",
          description: "Con qué frecuencia respaldar datos de pacientes",
          type: "input",
          required: true,
          completed: true,
          placeholder: "Diario",
          value: "Diario"
        }
      ]
    }
  }

  return checklists[moduleId] || null
}

export function ModuleChecklist({ modules, onProgress, onChecklistUpdate }: ModuleChecklistProps) {
  const [checklists, setChecklists] = useState<ModuleChecklist[]>([])
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  useEffect(() => {
    const moduleChecklists = modules
      .map(moduleId => getModuleChecklist(moduleId))
      .filter(Boolean) as ModuleChecklist[]
    
    setChecklists(moduleChecklists)
    if (moduleChecklists.length > 0 && !expandedModule) {
      setExpandedModule(moduleChecklists[0].moduleId)
    }

    // Notificar al componente padre sobre los checklists
    if (onChecklistUpdate) {
      onChecklistUpdate(moduleChecklists)
    }
  }, [modules, expandedModule, onChecklistUpdate])

  const updateChecklistItem = (moduleId: string, itemId: string, updates: Partial<ChecklistItem>) => {
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

    // Calcular progreso
    const moduleChecklist = checklists.find(c => c.moduleId === moduleId)
    if (moduleChecklist && onProgress) {
      const completed = moduleChecklist.items.filter(item => item.completed).length
      const total = moduleChecklist.items.length
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