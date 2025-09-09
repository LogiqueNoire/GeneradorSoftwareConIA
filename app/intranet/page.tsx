"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  LogOut,
  PenTool,
  Target,
  TrendingUp,
  FileText,
  Video,
  Globe,
  LinkedinIcon,
  Settings,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function IntranetPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem("internal_session")
    if (!session) {
      router.push("/internal-login")
      return
    }
    setUser(JSON.parse(session))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("internal_session")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">SystemGen Intranet</span>
              <p className="text-sm text-muted-foreground">Panel de Control Interno</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{user.email}</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Subprocesos de Automatización</h1>
          <p className="text-muted-foreground">
            Monitoreo y gestión de los procesos automatizados de atracción de clientes
          </p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Creación de Contenido
            </TabsTrigger>
            <TabsTrigger value="advertising" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Publicidad Dirigida
            </TabsTrigger>
          </TabsList>

          {/* Content Creation Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Content Generation Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-primary" />
                    Generación de Contenido IA
                  </CardTitle>
                  <CardDescription>Artículos y videos automatizados que dirigen al configurador</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contenido Generado Hoy</span>
                    <Badge variant="secondary">12 artículos</Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      "Cómo el chatbot para dentistas aumenta las citas un 30%"
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      "5 pasos para automatizar la facturación en tu e-commerce"
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      "Automatización de inventarios para restaurantes"
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Rendimiento del Contenido
                  </CardTitle>
                  <CardDescription>Métricas de engagement y conversión</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">2.4K</div>
                      <div className="text-sm text-muted-foreground">Vistas Totales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">18%</div>
                      <div className="text-sm text-muted-foreground">CTR al Configurador</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Artículos</span>
                      <span className="font-medium">85% engagement</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Videos</span>
                      <span className="font-medium">72% engagement</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Content Queue */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Cola de Contenido Programado
                  </CardTitle>
                  <CardDescription>Próximo contenido a publicar automáticamente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <FileText className="w-5 h-5 text-primary mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">"CRM automatizado: 40% más ventas en inmobiliarias"</h4>
                          <p className="text-xs text-muted-foreground mt-1">Programado para: Mañana 9:00 AM</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            Inmobiliarias
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Video className="w-5 h-5 text-accent mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">"Tutorial: Sistema de reservas para hoteles"</h4>
                          <p className="text-xs text-muted-foreground mt-1">Programado para: Mañana 2:00 PM</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            Hotelería
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advertising Tab */}
          <TabsContent value="advertising" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Campaign Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Campañas Activas
                  </CardTitle>
                  <CardDescription>Anuncios dirigidos directamente al configurador</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Campañas Ejecutándose</span>
                    <Badge variant="secondary">8 activas</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 border rounded">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Google Ads - Dentistas</div>
                        <div className="text-xs text-muted-foreground">CTR: 3.2%</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Activa
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 p-2 border rounded">
                      <LinkedinIcon className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">LinkedIn - E-commerce</div>
                        <div className="text-xs text-muted-foreground">CTR: 2.8%</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Activa
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Rendimiento de Campañas
                  </CardTitle>
                  <CardDescription>Métricas de conversión al configurador</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">156</div>
                      <div className="text-sm text-muted-foreground">Clicks Hoy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">24%</div>
                      <div className="text-sm text-muted-foreground">Conversión</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Google Ads</span>
                      <span className="font-medium">$2.40 CPC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>LinkedIn Ads</span>
                      <span className="font-medium">$4.80 CPC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Automation */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Automatización de Campañas
                  </CardTitle>
                  <CardDescription>Reglas y optimizaciones automáticas activas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Optimización de Pujas</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ajuste automático basado en conversiones al configurador
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Segmentación Dinámica</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Audiencias actualizadas según comportamiento en configurador
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">A/B Testing</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Pruebas automáticas de creativos y landing pages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
