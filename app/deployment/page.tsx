"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  ArrowLeft,
  Server,
  Database,
  Shield,
  Globe,
  TestTube,
  Rocket,
  Monitor,
  GitBranch,
  Package,
  Settings,
  Activity,
  Terminal,
  Download,
} from "lucide-react"
import Link from "next/link"

interface PipelineStep {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "completed" | "failed" | "skipped"
  duration?: number
  startTime?: string
  endTime?: string
  logs?: string[]
  substeps?: PipelineStep[]
}

interface DeploymentInfo {
  id: string
  clientName: string
  template: string
  environment: "staging" | "production"
  version: string
  startTime: string
  estimatedDuration: number
  currentStep: number
  totalSteps: number
}

export default function DeploymentPage() {
  const [deploymentInfo] = useState<DeploymentInfo>({
    id: "deploy-2024-001",
    clientName: "Clínica Dental Pro",
    template: "dental-clinic",
    environment: "production",
    version: "v1.0.0",
    startTime: "2024-01-15T10:30:00Z",
    estimatedDuration: 12,
    currentStep: 4,
    totalSteps: 8,
  })

  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([
    {
      id: "webhook-trigger",
      name: "Webhook Disparado",
      description: "Checklist completado al 100%, iniciando pipeline CI/CD",
      status: "completed",
      duration: 1,
      startTime: "10:30:00",
      endTime: "10:30:01",
      logs: [
        "✓ Webhook recibido desde portal de cliente",
        "✓ Validando configuración del cliente",
        "✓ Checklist verificado: 8/8 elementos completados",
        "✓ Iniciando pipeline de despliegue automático",
      ],
    },
    {
      id: "infrastructure",
      name: "Aprovisionamiento de Infraestructura",
      description: "Creando instancia aislada en la nube con Terraform",
      status: "completed",
      duration: 3,
      startTime: "10:30:01",
      endTime: "10:33:01",
      logs: [
        "✓ Ejecutando scripts de Terraform",
        "✓ Creando VPC aislada para el cliente",
        "✓ Configurando subredes y grupos de seguridad",
        "✓ Aprovisionando instancias EC2",
        "✓ Configurando balanceador de carga",
        "✓ Infraestructura lista y verificada",
      ],
      substeps: [
        {
          id: "vpc-creation",
          name: "Crear VPC",
          description: "Red privada virtual aislada",
          status: "completed",
          duration: 1,
        },
        {
          id: "security-groups",
          name: "Grupos de Seguridad",
          description: "Configuración de firewall",
          status: "completed",
          duration: 1,
        },
        {
          id: "load-balancer",
          name: "Balanceador de Carga",
          description: "Distribución de tráfico",
          status: "completed",
          duration: 1,
        },
      ],
    },
    {
      id: "database-setup",
      name: "Configuración de Base de Datos",
      description: "Desplegando base de datos con configuración específica",
      status: "completed",
      duration: 2,
      startTime: "10:33:01",
      endTime: "10:35:01",
      logs: [
        "✓ Creando instancia de base de datos PostgreSQL",
        "✓ Aplicando configuraciones de seguridad",
        "✓ Creando esquemas específicos del cliente",
        "✓ Configurando backups automáticos",
        "✓ Base de datos lista y accesible",
      ],
    },
    {
      id: "template-deployment",
      name: "Despliegue de Plantilla y Módulos",
      description: "Aplicando plantilla base y módulos personalizados",
      status: "running",
      startTime: "10:35:01",
      logs: [
        "✓ Clonando plantilla base: dental-clinic v2.1",
        "✓ Aplicando configuraciones del cliente",
        "⏳ Instalando módulos seleccionados...",
        "  - Módulo de agendamiento de citas",
        "  - Módulo de pagos por WhatsApp",
        "  - Módulo de gestión de pacientes",
        "⏳ Configurando integraciones...",
      ],
      substeps: [
        {
          id: "base-template",
          name: "Plantilla Base",
          description: "Dental Clinic v2.1",
          status: "completed",
          duration: 1,
        },
        {
          id: "modules-install",
          name: "Instalación de Módulos",
          description: "3 módulos personalizados",
          status: "running",
        },
        {
          id: "integrations",
          name: "Configurar Integraciones",
          description: "APIs y servicios externos",
          status: "pending",
        },
      ],
    },
    {
      id: "testing",
      name: "Pruebas de Aceptación Automatizadas",
      description: "Verificando funcionalidad completa del sistema",
      status: "pending",
      logs: [],
      substeps: [
        {
          id: "unit-tests",
          name: "Pruebas Unitarias",
          description: "Funciones individuales",
          status: "pending",
        },
        {
          id: "integration-tests",
          name: "Pruebas de Integración",
          description: "Conexiones entre módulos",
          status: "pending",
        },
        {
          id: "e2e-tests",
          name: "Pruebas End-to-End",
          description: "Flujos completos de usuario",
          status: "pending",
        },
      ],
    },
    {
      id: "security-scan",
      name: "Escaneo de Seguridad",
      description: "Verificación de vulnerabilidades y compliance",
      status: "pending",
      logs: [],
    },
    {
      id: "ssl-certificate",
      name: "Certificado SSL",
      description: "Configuración HTTPS y certificados de seguridad",
      status: "pending",
      logs: [],
    },
    {
      id: "final-deployment",
      name: "Despliegue Final",
      description: "Activación del sistema y notificación al cliente",
      status: "pending",
      logs: [],
      substeps: [
        {
          id: "dns-config",
          name: "Configuración DNS",
          description: "Dominio y subdominios",
          status: "pending",
        },
        {
          id: "monitoring-setup",
          name: "Monitoreo",
          description: "Alertas y métricas",
          status: "pending",
        },
        {
          id: "client-notification",
          name: "Notificación al Cliente",
          description: "Email de entrega",
          status: "pending",
        },
      ],
    },
  ])

  const [currentTime, setCurrentTime] = useState(new Date())
  const [showLogs, setShowLogs] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusIcon = (status: PipelineStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-primary" />
      case "running":
        return <Clock className="w-5 h-5 text-accent animate-pulse" />
      case "failed":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "skipped":
        return <div className="w-5 h-5 border-2 border-muted-foreground rounded-full opacity-50" />
      default:
        return <div className="w-5 h-5 border-2 border-muted rounded-full" />
    }
  }

  const getStatusColor = (status: PipelineStep["status"]) => {
    switch (status) {
      case "completed":
        return "border-primary bg-primary/5"
      case "running":
        return "border-accent bg-accent/5"
      case "failed":
        return "border-destructive bg-destructive/5"
      case "skipped":
        return "border-muted bg-muted/5"
      default:
        return "border-border"
    }
  }

  const getStepIcon = (stepId: string) => {
    const icons = {
      "webhook-trigger": GitBranch,
      infrastructure: Server,
      "database-setup": Database,
      "template-deployment": Package,
      testing: TestTube,
      "security-scan": Shield,
      "ssl-certificate": Globe,
      "final-deployment": Rocket,
    }
    return icons[stepId as keyof typeof icons] || Settings
  }

  const completedSteps = pipelineSteps.filter((step) => step.status === "completed").length
  const overallProgress = (completedSteps / pipelineSteps.length) * 100

  const elapsedTime = Math.floor((currentTime.getTime() - new Date(deploymentInfo.startTime).getTime()) / 1000 / 60)

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
                  <h1 className="text-xl font-bold text-foreground">Pipeline de Despliegue</h1>
                  <p className="text-sm text-muted-foreground">{deploymentInfo.clientName}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">ID: {deploymentInfo.id}</Badge>
              <Badge variant={deploymentInfo.environment === "production" ? "default" : "secondary"}>
                {deploymentInfo.environment}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Progreso General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completado</span>
                    <span>
                      {completedSteps}/{pipelineSteps.length}
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{Math.round(overallProgress)}% completado</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tiempo Transcurrido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-primary">{elapsedTime} min</div>
                  <div className="text-xs text-muted-foreground">Estimado: {deploymentInfo.estimatedDuration} min</div>
                  <Progress value={(elapsedTime / deploymentInfo.estimatedDuration) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Plantilla</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">Clínica Dental</div>
                  <div className="text-sm text-muted-foreground">Versión {deploymentInfo.version}</div>
                  <Badge variant="outline" className="text-xs">
                    3 módulos personalizados
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Estado Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent animate-pulse" />
                    <span className="font-medium">Desplegando</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Paso {deploymentInfo.currentStep} de {deploymentInfo.totalSteps}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pipeline" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pipeline" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Logs Detallados
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Recursos
              </TabsTrigger>
            </TabsList>

            {/* Pipeline Tab */}
            <TabsContent value="pipeline" className="space-y-6">
              <div className="space-y-4">
                {pipelineSteps.map((step, index) => {
                  const StepIcon = getStepIcon(step.id)
                  const isActive = step.status === "running"
                  const isNext = index > 0 && pipelineSteps[index - 1].status === "running" && step.status === "pending"

                  return (
                    <Card
                      key={step.id}
                      className={`transition-all ${getStatusColor(step.status)} ${isActive ? "ring-2 ring-accent" : ""}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                step.status === "completed"
                                  ? "bg-primary/20"
                                  : step.status === "running"
                                    ? "bg-accent/20"
                                    : step.status === "failed"
                                      ? "bg-destructive/20"
                                      : "bg-muted"
                              }`}
                            >
                              <StepIcon
                                className={`w-6 h-6 ${
                                  step.status === "completed"
                                    ? "text-primary"
                                    : step.status === "running"
                                      ? "text-accent"
                                      : step.status === "failed"
                                        ? "text-destructive"
                                        : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            {index < pipelineSteps.length - 1 && (
                              <div
                                className={`w-0.5 h-16 mt-4 ${
                                  step.status === "completed"
                                    ? "bg-primary"
                                    : step.status === "running"
                                      ? "bg-accent"
                                      : "bg-border"
                                }`}
                              />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">{step.name}</h3>
                                {getStatusIcon(step.status)}
                                {isNext && (
                                  <Badge variant="secondary" className="text-xs">
                                    Siguiente
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {step.duration && <span>{step.duration} min</span>}
                                {step.startTime && step.endTime && (
                                  <span>
                                    {step.startTime} - {step.endTime}
                                  </span>
                                )}
                                {step.startTime && !step.endTime && step.status === "running" && (
                                  <span>Iniciado: {step.startTime}</span>
                                )}
                              </div>
                            </div>

                            <p className="text-muted-foreground mb-4">{step.description}</p>

                            {/* Substeps */}
                            {step.substeps && step.substeps.length > 0 && (
                              <div className="space-y-2 mb-4">
                                <h4 className="text-sm font-medium text-foreground">Subtareas:</h4>
                                <div className="grid md:grid-cols-3 gap-2">
                                  {step.substeps.map((substep) => (
                                    <div
                                      key={substep.id}
                                      className={`p-3 border rounded-lg ${getStatusColor(substep.status)}`}
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        {getStatusIcon(substep.status)}
                                        <span className="text-sm font-medium">{substep.name}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{substep.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Recent Logs */}
                            {step.logs && step.logs.length > 0 && (
                              <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium">Logs Recientes:</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowLogs(showLogs === step.id ? null : step.id)}
                                  >
                                    {showLogs === step.id ? "Ocultar" : "Ver Todos"}
                                  </Button>
                                </div>
                                <div className="space-y-1">
                                  {(showLogs === step.id ? step.logs : step.logs.slice(-3)).map((log, logIndex) => (
                                    <div key={logIndex} className="text-sm font-mono text-muted-foreground">
                                      {log}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logs Completos del Despliegue</CardTitle>
                  <CardDescription>Registro detallado de todas las operaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
                    <div className="space-y-1">
                      <div>[10:30:00] INFO: Iniciando pipeline de despliegue para cliente: Clínica Dental Pro</div>
                      <div>[10:30:01] INFO: Webhook recibido, validando configuración...</div>
                      <div>[10:30:01] SUCCESS: Configuración validada correctamente</div>
                      <div>[10:30:01] INFO: Iniciando aprovisionamiento de infraestructura...</div>
                      <div>[10:30:02] INFO: Ejecutando terraform apply...</div>
                      <div>[10:31:15] SUCCESS: VPC creada: vpc-0123456789abcdef0</div>
                      <div>[10:32:30] SUCCESS: Instancias EC2 aprovisionadas</div>
                      <div>[10:33:01] SUCCESS: Infraestructura completada</div>
                      <div>[10:33:01] INFO: Configurando base de datos PostgreSQL...</div>
                      <div>[10:34:15] SUCCESS: Base de datos creada y configurada</div>
                      <div>[10:35:01] INFO: Desplegando plantilla dental-clinic v2.1...</div>
                      <div>[10:35:15] INFO: Instalando módulo: agendamiento-citas</div>
                      <div>[10:35:45] INFO: Instalando módulo: pagos-whatsapp</div>
                      <div>[10:36:20] INFO: Instalando módulo: gestion-pacientes</div>
                      <div className="text-yellow-400">[10:36:45] RUNNING: Configurando integraciones externas...</div>
                      <div className="text-yellow-400">[10:36:46] RUNNING: Conectando con Google Calendar API...</div>
                      <div className="text-yellow-400">[10:36:47] RUNNING: Configurando Stripe webhook...</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-muted-foreground">Actualizándose en tiempo real</p>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Infraestructura Aprovisionada</CardTitle>
                    <CardDescription>Recursos creados para tu sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Server className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Servidor Principal</p>
                            <p className="text-sm text-muted-foreground">t3.medium (2 vCPU, 4GB RAM)</p>
                          </div>
                        </div>
                        <Badge variant="default">Activo</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Database className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Base de Datos</p>
                            <p className="text-sm text-muted-foreground">PostgreSQL 14.9</p>
                          </div>
                        </div>
                        <Badge variant="default">Activo</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-accent" />
                          <div>
                            <p className="font-medium">Balanceador de Carga</p>
                            <p className="text-sm text-muted-foreground">Application Load Balancer</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Configurando</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Certificado SSL</p>
                            <p className="text-sm text-muted-foreground">Let's Encrypt</p>
                          </div>
                        </div>
                        <Badge variant="outline">Pendiente</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configuración del Sistema</CardTitle>
                    <CardDescription>Parámetros y módulos instalados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Plantilla Base</h4>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm">Clínica Dental v2.1</p>
                          <p className="text-xs text-muted-foreground">Incluye gestión básica de citas y pacientes</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Módulos Personalizados</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-primary/5 border border-primary/20 rounded">
                            <span className="text-sm">Agendamiento de Citas</span>
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-accent/5 border border-accent/20 rounded">
                            <span className="text-sm">Pagos por WhatsApp</span>
                            <Clock className="w-4 h-4 text-accent animate-pulse" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-muted/50 border rounded">
                            <span className="text-sm">Gestión de Pacientes</span>
                            <div className="w-4 h-4 border-2 border-muted rounded-full" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Integraciones</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-primary/5 border border-primary/20 rounded">
                            <span className="text-sm">Google Calendar</span>
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-accent/5 border border-accent/20 rounded">
                            <span className="text-sm">Stripe Payments</span>
                            <Clock className="w-4 h-4 text-accent animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
