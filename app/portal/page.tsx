"use client"

import React, { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress" 
import { 
  User, 
  LogOut, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Settings, 
  Database,  
  BarChart3,
  Zap,
  Shield,  
  Bell, 
  Rocket, 
  Star,
  Heart,
  Sparkles
} from "lucide-react"

// Tipos
interface ChecklistItem {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "pending"
  required: boolean
  category: "integrations" | "business" | "technical" | "branding" | "payments" | "communications"
  validationMessage?: string
  instructions?: string
}

export default function PortalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "google-auth",
      title: "✅ Autenticación Google OAuth",
      description: "Sistema de Single Sign-On configurado y funcionando",
      status: "completed",
      required: true,
      category: "integrations",
      validationMessage: "¡Perfecto! Ya estás autenticado con Google",
    },
    {
      id: "database-setup",
      title: "🗄️ Configurar Base de Datos",
      description: "Conectar PostgreSQL/MongoDB para persistir datos",
      status: "pending",
      required: true,
      category: "technical",
      instructions: "Configura DATABASE_URL en variables de entorno",
    },
    {
      id: "ui-theme",
      title: "🎨 Personalizar Tema",
      description: "Ajustar colores, tipografías y branding de la aplicación",
      status: "in-progress",
      required: false,
      category: "branding",
    },
    {
      id: "api-routes",
      title: "🔌 Crear APIs REST",
      description: "Desarrollar endpoints para tu lógica de negocio",
      status: "pending",
      required: true,
      category: "technical",
      instructions: "Crear rutas en /app/api/ para tu funcionalidad específica",
    },
    {
      id: "payment-system",
      title: "💳 Sistema de Pagos",
      description: "Integrar Stripe/PayPal para monetización",
      status: "pending",
      required: false,
      category: "payments",
    },
    {
      id: "email-notifications",
      title: "📧 Notificaciones Email",
      description: "Configurar Resend/SendGrid para emails transaccionales",
      status: "pending",
      required: false,
      category: "communications",
    },
  ])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Mostrar loading mientras verifica la sesión
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Sparkles className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 font-medium">Verificando tu sesión...</p>
        </div>
      </div>
    )
  }

  // No mostrar nada si no está autenticado (se redirigirá)
  if (!session) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/",
      redirect: true 
    })
  }

  const filteredChecklist = checklist.filter(item => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false
    return true
  })

  const completedCount = checklist.filter(item => item.status === "completed").length
  const totalCount = checklist.length
  const progressPercentage = (completedCount / totalCount) * 100

  const getStatusIcon = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />
      case "pending":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
    }
  }

  const getStatusBadge = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Completado</Badge>
      case "in-progress":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">En Progreso</Badge>
      case "pending":
        return <Badge variant="outline" className="text-amber-600 border-amber-300">Pendiente</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header mejorado */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  SystemGen Portal
                </h1>
                <p className="text-slate-600 text-sm">
                  ¡Hola {session.user?.name?.split(' ')[0] || 'Developer'}! 👋
                </p>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tarjeta de bienvenida mejorada */}
        <div className="mb-8">
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Star className="w-8 h-8 text-yellow-300" />
                    ¡Autenticación SSO Exitosa!
                  </h2>
                  <p className="text-blue-100 text-lg mb-4">
                    Tu sistema de Single Sign-On está funcionando perfectamente
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {session.user?.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Google OAuth
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <Heart className="w-12 h-12 text-pink-300" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{Math.round(progressPercentage)}%</p>
                  <p className="text-sm text-slate-500">Completado</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Progreso del Proyecto</p>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{completedCount}/{totalCount}</p>
                  <p className="text-sm text-slate-500">Tareas</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-700">Elementos Completados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">Listo</p>
                  <p className="text-sm text-slate-500">para Deploy</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-700">Estado del Sistema</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de tareas mejorada */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Settings className="w-6 h-6 text-slate-600" />
              Próximos Pasos del Desarrollo
            </CardTitle>
            <CardDescription className="text-base">
              Continúa desarrollando tu aplicación con estos elementos clave
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Filtros mejorados */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="transition-all"
              >
                🌟 Todas
              </Button>
              <Button
                variant={selectedCategory === "integrations" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("integrations")}
                className="transition-all"
              >
                🔌 Integraciones
              </Button>
              <Button
                variant={selectedCategory === "technical" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("technical")}
                className="transition-all"
              >
                ⚙️ Técnico
              </Button>
              <Button
                variant={selectedCategory === "branding" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("branding")}
                className="transition-all"
              >
                🎨 Diseño
              </Button>
            </div>

            {/* Lista de tareas con mejor diseño */}
            <div className="space-y-4">
              {filteredChecklist.map((item, index) => (
                <div
                  key={item.id}
                  className="group p-6 border-2 border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 hover:shadow-md"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 text-lg">{item.title}</h3>
                        {getStatusBadge(item.status)}
                        {item.required && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                            Importante
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 mb-3 leading-relaxed">{item.description}</p>
                      
                      {item.validationMessage && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg mb-3">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <p className="text-sm text-emerald-700 font-medium">{item.validationMessage}</p>
                        </div>
                      )}
                      
                      {item.instructions && item.status !== "completed" && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-700">{item.instructions}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {item.status !== "completed" && (
                        <Button 
                          size="sm" 
                          className="group-hover:shadow-md transition-all"
                          variant={item.status === "in-progress" ? "default" : "outline"}
                        >
                          {item.status === "in-progress" ? "Continuar" : "Comenzar"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> 
      </div>
    </div>
  )
}