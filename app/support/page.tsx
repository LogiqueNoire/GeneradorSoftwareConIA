"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Send,
  Bot,
  Zap,
  ArrowLeft,
  ShoppingCart,
  Calendar,
  CreditCard,
  Sparkles,
  BookOpen,
  HelpCircle,
  MessageCircle,
  X,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  clientName: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  aiSuggestion?: string
}

interface AnalyticsData {
  totalQueries: number
  resolvedByAI: number
  avgResponseTime: number
  satisfactionScore: number
  topCategories: { name: string; count: number }[]
  upsellOpportunities: number
}

export default function SupportPage() {
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([
    {
      role: "assistant" as const,
      content:
        "¡Hola! Soy tu Asistente IA de Soporte 24/7. Tengo acceso completo a toda la documentación técnica, guías de configuración, y base de conocimientos de SystemGen. ¿En qué puedo ayudarte hoy?",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showChatbot) {
        setShowChatbot(true)
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "👋 ¡Hola! Veo que estás en el centro de ayuda. ¿Te gustaría que te ayude a encontrar la información que necesitas?",
          },
        ])
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [showChatbot])

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isTyping) return

    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }])
    setChatInput("")
    setIsTyping(true)

    setTimeout(() => {
      const responses = [
        "Perfecto, he encontrado la información en nuestra documentación. Para configurar Google Calendar, ve a Integraciones > Google Calendar y autoriza el acceso. ¿Necesitas que te guíe paso a paso?",
        "He revisado tu historial de facturación. Tu plan actual es Pro ($199/mes) con 3 módulos activos. ¿Hay algún cargo específico que quieras revisar?",
        "Basándome en tu configuración actual, recomiendo estos módulos: Analítica Avanzada ($59/mes) - perfecto para tu volumen de datos, y Telemedicina ($79/mes) - ideal para tu tipo de clínica. ¿Te interesa alguno?",
        "He analizado tu sistema y detecté que podrías optimizar el rendimiento activando el caché automático. ¿Quieres que te explique cómo configurarlo?",
        "Según nuestra base de conocimientos, este error se resuelve regenerando el token de API. ¿Quieres que te guíe en el proceso o prefieres que lo haga automáticamente?",
      ]

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  const [tickets] = useState([
    {
      id: "TICK-001",
      title: "Error en integración con Google Calendar",
      description: "Las citas no se sincronizan correctamente con Google Calendar después de la configuración",
      status: "in-progress",
      priority: "high",
      category: "Integraciones",
      clientName: "Clínica Dental Pro",
      createdAt: "2024-01-15T09:15:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      assignedTo: "Ana García",
      aiSuggestion: "Verificar permisos de API y regenerar token de acceso",
    },
    {
      id: "TICK-002",
      title: "Solicitud de módulo personalizado",
      description: "Cliente solicita módulo de telemedicina para consultas virtuales",
      status: "open",
      priority: "medium",
      category: "Nuevas Funcionalidades",
      clientName: "Centro Médico Salud+",
      createdAt: "2024-01-15T08:45:00Z",
      updatedAt: "2024-01-15T08:45:00Z",
      aiSuggestion: "Oportunidad de upselling - módulo de telemedicina disponible por $79/mes",
    },
    {
      id: "TICK-003",
      title: "Problema con pagos por WhatsApp",
      description: "Los enlaces de pago no se generan correctamente en los mensajes de WhatsApp",
      status: "resolved",
      priority: "high",
      category: "Pagos",
      clientName: "Tienda Fashion Style",
      createdAt: "2024-01-14T16:20:00Z",
      updatedAt: "2024-01-15T09:00:00Z",
      assignedTo: "Carlos Ruiz",
    },
  ])

  const [analytics] = useState({
    totalQueries: 1247,
    resolvedByAI: 1121,
    avgResponseTime: 1.2,
    satisfactionScore: 4.7,
    topCategories: [
      { name: "Configuración", count: 342 },
      { name: "Integraciones", count: 298 },
      { name: "Facturación", count: 187 },
      { name: "Módulos", count: 156 },
      { name: "Seguridad", count: 89 },
    ],
    upsellOpportunities: 23,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-primary text-primary-foreground"
      case "in-progress":
        return "bg-accent text-accent-foreground"
      case "open":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-destructive"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-accent"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/portal" className="flex items-center gap-4">
              <ArrowLeft className="w-5 h-5" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Centro de Ayuda</h1>
                  <p className="text-sm text-muted-foreground">Asistente IA - Soporte 24/7</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                IA Avanzada
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Asistente IA - Soporte 24/7</h2>
            <p className="text-lg text-muted-foreground">
              Pregunta cualquier cosa sobre tu sistema. Nuestro asistente IA tiene acceso a toda la documentación.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Asistente IA Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Precisión de Respuestas</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">0.3s</div>
                      <div className="text-xs text-muted-foreground">Tiempo respuesta</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">4.9</div>
                      <div className="text-xs text-muted-foreground">Satisfacción</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Consultas Frecuentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-primary/5"
                    onClick={() => setShowChatbot(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Configurar Integraciones
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-primary/5"
                    onClick={() => setShowChatbot(true)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Consultas de Facturación
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-primary/5"
                    onClick={() => setShowChatbot(true)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Módulos Recomendados
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-primary/5"
                    onClick={() => setShowChatbot(true)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Guía de Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Soporte Disponible</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">IA Disponible 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Soporte Humano 9AM-6PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Emergencias 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showChatbot && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="w-96 h-96 shadow-2xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Asistente IA</CardTitle>
                    <CardDescription className="text-xs">Guía Inteligente</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowChatbot(false)} className="h-6 w-6 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-80">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t">
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    className="flex-1 text-sm"
                  />
                  <Button type="submit" size="sm" disabled={isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!showChatbot && (
        <Button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  )
}
