"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  ExternalLink,
  Zap,
  User,
  Settings,
  HelpCircle,
  FileText,
  Calendar,
  Database,
  Shield,
  Play,
  Pause,
  RotateCcw,
  Bell,
  MessageSquare,
  Send,
  Home,
  LogOut,
} from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "failed"
  required: boolean
  category: string
  instructions?: string
  validationMessage?: string
}

interface SystemStatus {
  overall: "setup" | "deploying" | "active" | "maintenance"
  deployment: number
  lastUpdate: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ClientPortalPage() {
  const [showTour, setShowTour] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    overall: "setup",
    deployment: 0,
    lastUpdate: "2024-01-15 10:30:00",
  })

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "google-calendar",
      title: "Conectar Google Calendar",
      description: "Integra tu calendario para sincronizar citas automáticamente",
      status: "completed",
      required: true,
      category: "integrations",
      validationMessage: "Conexión verificada correctamente",
    },
    {
      id: "logo-upload",
      title: "Subir Logo de la Empresa",
      description: "Logo en formato PNG, mínimo 512x512px, fondo transparente",
      status: "completed",
      required: true,
      category: "branding",
      validationMessage: "Logo validado - dimensiones correctas",
    },
    {
      id: "crm-api",
      title: "Proporcionar API Key del CRM",
      description: "Conecta tu CRM existente para sincronizar datos de clientes",
      status: "in-progress",
      required: true,
      category: "integrations",
      instructions: "Ve a tu CRM > Configuración > API Keys > Generar nueva clave",
    },
    {
      id: "payment-config",
      title: "Configurar Pasarela de Pagos",
      description: "Configura Stripe para procesar pagos automáticamente",
      status: "pending",
      required: true,
      category: "payments",
      instructions: "Necesitarás tu Stripe Secret Key y Webhook URL",
    },
    {
      id: "whatsapp-business",
      title: "Conectar WhatsApp Business",
      description: "Habilita notificaciones automáticas por WhatsApp",
      status: "pending",
      required: false,
      category: "communications",
    },
    {
      id: "custom-domain",
      title: "Configurar Dominio Personalizado",
      description: "Opcional: usa tu propio dominio para el sistema",
      status: "pending",
      required: false,
      category: "advanced",
    },
    {
      id: "ssl-certificate",
      title: "Certificado SSL",
      description: "Configuración automática de seguridad HTTPS",
      status: "completed",
      required: true,
      category: "security",
      validationMessage: "Certificado SSL activo y válido",
    },
    {
      id: "backup-config",
      title: "Configurar Backups Automáticos",
      description: "Sistema de respaldo diario de tus datos",
      status: "completed",
      required: true,
      category: "security",
      validationMessage: "Backups programados cada 24 horas",
    },
  ])

  const completedItems = checklist.filter((item) => item.status === "completed").length
  const totalItems = checklist.length
  const requiredItems = checklist.filter((item) => item.required)
  const completedRequired = requiredItems.filter((item) => item.status === "completed").length
  const progressPercentage = (completedItems / totalItems) * 100
  const requiredProgress = (completedRequired / requiredItems.length) * 100

  const tourSteps = [
    {
      title: "¡Bienvenido a tu Portal!",
      description:
        "Este es tu centro de control donde puedes ver el progreso de tu sistema y gestionar la configuración.",
      target: "dashboard",
    },
    {
      title: "Checklist de Configuración",
      description: "Completa estos elementos para que podamos desplegar tu sistema personalizado.",
      target: "checklist",
    },
    {
      title: "Estado del Sistema",
      description: "Aquí verás el progreso del despliegue y el estado actual de tu sistema.",
      target: "status",
    },
    {
      title: "Documentación y Ayuda",
      description: "Encuentra guías detalladas y contacta soporte si necesitas ayuda.",
      target: "help",
    },
  ]

  useEffect(() => {
    // Simulate first-time user
    const hasSeenTour = localStorage.getItem("portal-tour-seen")
    if (!hasSeenTour) {
      setShowTour(true)
    }
  }, [])

  const handleTourNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1)
    } else {
      setShowTour(false)
      localStorage.setItem("portal-tour-seen", "true")
    }
  }

  const handleTourSkip = () => {
    setShowTour(false)
    localStorage.setItem("portal-tour-seen", "true")
  }

  const updateChecklistItem = (id: string, status: ChecklistItem["status"]) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response for demo purposes
      setTimeout(() => {
        const responses = [
          "Para configurar tu CRM, necesitas acceder a la sección de API Keys en tu panel de administración. Una vez allí, genera una nueva clave y cópiala en el campo correspondiente de tu checklist.",
          "El certificado SSL se configura automáticamente cuando tu dominio esté activo. No necesitas hacer nada adicional, nuestro sistema se encarga de todo.",
          "Para conectar WhatsApp Business, necesitarás verificar tu número de teléfono comercial y obtener el token de acceso desde Meta Business.",
          "Los backups automáticos se ejecutan cada 24 horas a las 2:00 AM. Puedes restaurar cualquier backup desde los últimos 30 días.",
          "Si necesitas ayuda con alguna configuración específica, puedo guiarte paso a paso. ¿Qué elemento del checklist te está dando problemas?",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: randomResponse,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Chat error:", error)
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-primary" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-accent animate-pulse" />
      case "failed":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      default:
        return <div className="w-5 h-5 border-2 border-muted rounded-full" />
    }
  }

  const getStatusColor = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "completed":
        return "border-primary bg-primary/5"
      case "in-progress":
        return "border-accent bg-accent/5"
      case "failed":
        return "border-destructive bg-destructive/5"
      default:
        return "border-border"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "integrations":
        return <Database className="w-4 h-4" />
      case "branding":
        return <Upload className="w-4 h-4" />
      case "payments":
        return <Calendar className="w-4 h-4" />
      case "communications":
        return <MessageSquare className="w-4 h-4" />
      case "security":
        return <Shield className="w-4 h-4" />
      case "advanced":
        return <Settings className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Tour Overlay */}
      {showTour && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{tourSteps[tourStep].title}</CardTitle>
                <Badge variant="secondary">
                  {tourStep + 1} de {tourSteps.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{tourSteps[tourStep].description}</p>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleTourSkip}>
                  Saltar Tour
                </Button>
                <Button onClick={handleTourNext}>
                  {tourStep === tourSteps.length - 1 ? "Finalizar" : "Siguiente"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Portal de Cliente</h1>
                  <p className="text-sm text-muted-foreground">Clínica Dental Pro</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Inicio
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setShowTour(true)}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Tour Guiado
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Dr. García</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Configuración
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Estado del Sistema
              </TabsTrigger>
              <TabsTrigger value="help" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Ayuda
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6" id="dashboard">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Progreso General</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Completado</span>
                        <span>
                          {completedItems}/{totalItems}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {Math.round(progressPercentage)}% de configuración completada
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Elementos Requeridos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Completado</span>
                        <span>
                          {completedRequired}/{requiredItems.length}
                        </span>
                      </div>
                      <Progress value={requiredProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {requiredProgress === 100 ? "¡Listo para despliegue!" : "Faltan elementos requeridos"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Estado del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {systemStatus.overall === "setup" && <Clock className="w-4 h-4 text-accent" />}
                        {systemStatus.overall === "deploying" && (
                          <RotateCcw className="w-4 h-4 text-primary animate-spin" />
                        )}
                        {systemStatus.overall === "active" && <CheckCircle className="w-4 h-4 text-primary" />}
                        <span className="capitalize font-medium">
                          {systemStatus.overall === "setup" && "En Configuración"}
                          {systemStatus.overall === "deploying" && "Desplegando"}
                          {systemStatus.overall === "active" && "Activo"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Última actualización: {new Date(systemStatus.lastUpdate).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Pasos</CardTitle>
                    <CardDescription>Elementos pendientes para completar tu configuración</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {checklist
                        .filter((item) => item.status === "pending" || item.status === "in-progress")
                        .slice(0, 3)
                        .map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            {getStatusIcon(item.status)}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                            {item.required && (
                              <Badge variant="secondary" className="text-xs">
                                Requerido
                              </Badge>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recursos Útiles</CardTitle>
                    <CardDescription>Documentación y herramientas para tu sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Guía de Configuración
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar Logos y Assets
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contactar Soporte
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Checklist Tab */}
            <TabsContent value="checklist" className="space-y-6" id="checklist">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Checklist de Configuración</h2>
                  <p className="text-muted-foreground">
                    Completa todos los elementos requeridos para activar tu sistema
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Progreso</p>
                  <p className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</p>
                </div>
              </div>

              <div className="space-y-4">
                {["integrations", "branding", "payments", "communications", "security", "advanced"].map((category) => {
                  const categoryItems = checklist.filter((item) => item.category === category)
                  if (categoryItems.length === 0) return null

                  const categoryNames = {
                    integrations: "Integraciones",
                    branding: "Marca y Diseño",
                    payments: "Pagos",
                    communications: "Comunicaciones",
                    security: "Seguridad",
                    advanced: "Configuración Avanzada",
                  }

                  return (
                    <Card key={category}>
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {getCategoryIcon(category)}
                          {categoryNames[category as keyof typeof categoryNames]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {categoryItems.map((item) => (
                            <div
                              key={item.id}
                              className={`p-4 border rounded-lg transition-all ${getStatusColor(item.status)}`}
                            >
                              <div className="flex items-start gap-3">
                                {getStatusIcon(item.status)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium">{item.title}</h3>
                                    {item.required && (
                                      <Badge variant="secondary" className="text-xs">
                                        Requerido
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>

                                  {item.status === "completed" && item.validationMessage && (
                                    <div className="flex items-center gap-2 text-sm text-primary">
                                      <CheckCircle className="w-4 h-4" />
                                      {item.validationMessage}
                                    </div>
                                  )}

                                  {item.status === "in-progress" && item.instructions && (
                                    <div className="bg-accent/10 border border-accent/20 rounded p-3 mt-2">
                                      <p className="text-sm text-accent-foreground font-medium mb-1">Instrucciones:</p>
                                      <p className="text-sm text-muted-foreground">{item.instructions}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  {item.status === "pending" && (
                                    <Button size="sm" onClick={() => updateChecklistItem(item.id, "in-progress")}>
                                      Comenzar
                                    </Button>
                                  )}
                                  {item.status === "in-progress" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateChecklistItem(item.id, "pending")}
                                      >
                                        Pausar
                                      </Button>
                                      <Button size="sm" onClick={() => updateChecklistItem(item.id, "completed")}>
                                        Completar
                                      </Button>
                                    </>
                                  )}
                                  {item.status === "completed" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateChecklistItem(item.id, "in-progress")}
                                    >
                                      Editar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {requiredProgress === 100 && (
                <Card className="border-primary bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">¡Configuración Completada!</h3>
                      <p className="text-muted-foreground mb-4">
                        Todos los elementos requeridos están listos. Tu sistema será desplegado automáticamente.
                      </p>
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        Iniciar Despliegue Automático
                        <Play className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Status Tab */}
            <TabsContent value="status" className="space-y-6" id="status">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Estado del Sistema</h2>
                <p className="text-muted-foreground">
                  Monitoreo en tiempo real del despliegue y operación de tu sistema
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estado Actual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Estado General:</span>
                        <Badge variant={systemStatus.overall === "active" ? "default" : "secondary"}>
                          {systemStatus.overall === "setup" && "En Configuración"}
                          {systemStatus.overall === "deploying" && "Desplegando"}
                          {systemStatus.overall === "active" && "Activo"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Progreso de Despliegue:</span>
                        <span>{systemStatus.deployment}%</span>
                      </div>
                      <Progress value={systemStatus.deployment} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Última actualización:</span>
                        <span>{new Date(systemStatus.lastUpdate).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Sistema
                        <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                        <Pause className="w-4 h-4 mr-2" />
                        Pausar Sistema
                        <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reiniciar Sistema
                        <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Log de Actividad</CardTitle>
                  <CardDescription>Historial de eventos y cambios en tu sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        time: "10:30",
                        event: "Configuración SSL completada",
                        status: "success",
                      },
                      {
                        time: "10:25",
                        event: "Logo validado correctamente",
                        status: "success",
                      },
                      {
                        time: "10:20",
                        event: "Conexión con Google Calendar establecida",
                        status: "success",
                      },
                      {
                        time: "10:15",
                        event: "Iniciando configuración del sistema",
                        status: "info",
                      },
                      {
                        time: "10:10",
                        event: "Portal de cliente activado",
                        status: "success",
                      },
                    ].map((log, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="text-xs text-muted-foreground w-12">{log.time}</div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            log.status === "success"
                              ? "bg-primary"
                              : log.status === "error"
                                ? "bg-destructive"
                                : "bg-accent"
                          }`}
                        />
                        <div className="flex-1 text-sm">{log.event}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Help Tab */}
            <TabsContent value="help" className="space-y-6" id="help">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Centro de Ayuda</h2>
                <p className="text-muted-foreground">
                  Encuentra respuestas, documentación y contacta con nuestro equipo de soporte
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentación</CardTitle>
                    <CardDescription>Guías paso a paso para configurar tu sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <FileText className="w-4 h-4 mr-2" />
                        Guía de Configuración Inicial
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Database className="w-4 h-4 mr-2" />
                        Configurar Integraciones
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Shield className="w-4 h-4 mr-2" />
                        Configuración de Seguridad
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        Configuración Avanzada
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Asistente IA - Soporte 24/7
                    </CardTitle>
                    <CardDescription>
                      Pregunta cualquier cosa sobre tu sistema. Nuestro asistente IA tiene acceso a toda la
                      documentación.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Chat Messages */}
                      <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3 bg-muted/20">
                        {messages.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                              ¡Hola! Soy tu asistente IA. Pregúntame sobre configuración, integraciones, o cualquier
                              duda técnica.
                            </p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                  message.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background border"
                                }`}
                              >
                                {message.content}
                              </div>
                            </div>
                          ))
                        )}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-background border p-3 rounded-lg text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Chat Input */}
                      <form onSubmit={handleChatSubmit} className="flex gap-2">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Escribe tu pregunta aquí..."
                          disabled={isLoading}
                          className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>

                      <div className="text-center pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Asistente IA Inteligente • Respuesta promedio: <span className="font-medium">2 segundos</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Otras Opciones de Soporte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-4 h-4 text-accent" />
                        <span className="font-medium">Crear Ticket de Soporte</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Para problemas técnicos complejos o consultas específicas
                      </p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Crear Ticket de Soporte
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">Agendar Consulta</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Habla directamente con un especialista técnico
                      </p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Agendar Consulta
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
