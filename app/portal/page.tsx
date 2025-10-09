"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ModuleChecklist } from "@/components/module-checklist"
import { useChecklistDeployment } from "@/lib/checklist-to-n8n"
import { 
  User, 
  LogOut, 
  CheckCircle, 
  BarChart3,
  Zap,
  Shield,  
  Rocket, 
  Star,
  Heart,
  Sparkles,
  Package,
  Send,
  CheckCircle2
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
  
  // Estados para módulos y progreso
  const [purchasedModules, setPurchasedModules] = useState<string[]>([])
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({})
  const [moduleChecklists, setModuleChecklists] = useState<any[]>([])
  const [userPurchases, setUserPurchases] = useState<any>(null)
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true)
  
  // Hook para deployment
  const { startDeployment, isDeploying, deploymentResult } = useChecklistDeployment()

  // Cargar módulos comprados desde la API
  useEffect(() => {
    const loadUserPurchases = async () => {
      if (session?.user?.email) {
        try {
          setIsLoadingPurchases(true)
          const response = await fetch('/api/user/purchases')
          const result = await response.json()
          
          if (result.success && result.data) {
            setUserPurchases(result.data)
            setPurchasedModules(result.data.customerInfo.modules || [])
            
            // Calcular progreso inicial basado en configuraciones
            const initialProgress: Record<string, number> = {}
            result.data.moduleConfigurations?.forEach((module: any) => {
              initialProgress[module.moduleId] = module.completionPercentage || 0
            })
            setModuleProgress(initialProgress)
          } else {
            // No hay compras, limpiar todo
            setUserPurchases(null)
            setPurchasedModules([])
            setModuleProgress({})
          }
        } catch (error) {
          console.error("[PORTAL] Error loading user purchases:", error)
          // No mostrar nada si falla la API
          setUserPurchases(null)
          setPurchasedModules([])
          setModuleProgress({})
        } finally {
          setIsLoadingPurchases(false)
        }
      } else {
        setIsLoadingPurchases(false)
      }
    }

    loadUserPurchases()
  }, [session])

  // Manejar progreso de módulos
  const handleModuleProgress = useCallback((moduleId: string, progress: number) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: progress
    }))
  }, [])

  // Manejar datos de checklist actualizados
  const handleChecklistUpdate = useCallback((checklists: any[]) => {
    setModuleChecklists(checklists)
  }, [])

  // Iniciar deployment
  const handleStartDeployment = async () => {
    const result = await startDeployment()
    
    if (result.success) {
      alert(`¡Deployment iniciado! ID: ${result.deploymentId}`)
    } else {
      alert(`Error en deployment: ${result.error}`)
    }
  }

  // Calcular si se puede hacer deployment
  const canDeploy = () => {
    const totalModules = purchasedModules.length
    const completedModules = Object.values(moduleProgress).filter(progress => progress >= 70).length
    return totalModules > 0 && completedModules >= totalModules * 0.8 // 80% de módulos al 70%
  }

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

        {/* Estadísticas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {purchasedModules.length > 0 
                      ? Math.round(Object.values(moduleProgress).reduce((a, b) => a + b, 0) / purchasedModules.length) 
                      : 0}%
                  </p>
                  <p className="text-sm text-slate-500">Promedio</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Progreso de Módulos</p>
                <Progress 
                  value={purchasedModules.length > 0 
                    ? Object.values(moduleProgress).reduce((a, b) => a + b, 0) / purchasedModules.length 
                    : 0} 
                  className="h-2" 
                />
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
                  <p className="text-2xl font-bold text-slate-900">{purchasedModules.length}</p>
                  <p className="text-sm text-slate-500">Módulos</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-700">Módulos Comprados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {canDeploy() ? "Listo" : "Pending"}
                  </p>
                  <p className="text-sm text-slate-500">Deploy</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-700">Estado del Sistema</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal - solo módulos comprados */}
        <div className="space-y-6">
          {!isLoadingPurchases && userPurchases && purchasedModules.length > 0 ? (
            <>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-primary" />
                    Configuración de Módulos Comprados ({purchasedModules.length})
                  </CardTitle>
                  <CardDescription>
                    Configura las APIs y credenciales necesarias para cada módulo que compraste. 
                    Estos datos se almacenan localmente y no se envían a ningún servidor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingPurchases ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Cargando módulos comprados...</p>
                    </div>
                  ) : userPurchases ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {userPurchases.moduleConfigurations?.map((module: any) => {
                          const progress = module.completionPercentage || 0
                          return (
                            <Card key={module.moduleId} className="border-2">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-primary mb-1">
                                  {Math.round(progress)}%
                                </div>
                                <div className="text-xs text-muted-foreground font-medium">
                                  {module.moduleName}
                                </div>
                                <Progress value={progress} className="h-1 mt-2" />
                                <div className="text-xs text-muted-foreground mt-1">
                                  {module.items?.filter((item: any) => item.completed).length || 0} / {module.items?.length || 0} configurados
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {purchasedModules.map((moduleId) => {
                        const progress = moduleProgress[moduleId] || 0
                        return (
                          <Card key={moduleId} className="border-2">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-primary mb-1">
                                {Math.round(progress)}%
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {moduleId.replace('-', ' ')}
                              </div>
                              <Progress value={progress} className="h-1 mt-2" />
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Botón de Deployment */}
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        Iniciar Deployment
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {canDeploy() 
                          ? "Tu configuración está lista para ser deployada. Este proceso tomará 5-10 minutos."
                          : "Completa al menos el 70% de configuración en el 80% de tus módulos para poder deployar."
                        }
                      </p>
                      {deploymentResult && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          deploymentResult.success 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <p className={`text-sm font-medium ${
                            deploymentResult.success ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {deploymentResult.success 
                              ? `✅ Deployment iniciado: ${deploymentResult.deploymentId}`
                              : `❌ Error: ${deploymentResult.error}`
                            }
                          </p>
                          {deploymentResult.warnings && deploymentResult.warnings.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-amber-600">⚠️ Advertencias:</p>
                              <ul className="text-xs text-amber-600 list-disc list-inside">
                                {deploymentResult.warnings.map((warning: string, index: number) => (
                                  <li key={index}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      {canDeploy() && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Listo para Deploy
                        </div>
                      )}
                      <Button
                        onClick={handleStartDeployment}
                        disabled={!canDeploy() || isDeploying}
                        size="lg"
                        className="min-w-[150px]"
                      >
                        {isDeploying ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Deployando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Iniciar Deployment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <ModuleChecklist 
                modules={purchasedModules}
                moduleConfigurations={userPurchases?.moduleConfigurations || []}
                onProgress={handleModuleProgress}
                onChecklistUpdate={handleChecklistUpdate}
              />
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hay módulos comprados</h3>
                <p className="text-muted-foreground mb-4">
                  Parece que aún no has comprado ningún módulo. Visita el configurador para agregar funcionalidades a tu sistema.
                </p>
                <Button onClick={() => router.push('/configurator')}>
                  Ir al Configurador
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}