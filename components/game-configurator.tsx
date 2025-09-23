"use client"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ArrowRight,
  Users,
  ShoppingCart,
  Database,
  CheckCircle,
  Star,
  Trophy,
  Crown,
  Gift,
  Sparkles,
  DollarSign,
  Settings,
  Rocket,
  Target,
  Plus,
  Minus,
  Lock,
  CreditCard,
  User,
  Loader2,
} from "lucide-react"

interface GameConfiguratorProps {
  onBack: () => void
  userLevel: number
  experience: number
  onLevelUp: (newLevel: number, newExp: number) => void
}

interface SystemModule {
  id: string
  name: string
  description: string
  price: number
  xp: number
  icon: any
  category: string
  unlocked: boolean
  selected: boolean
}

export function GameConfigurator({ onBack, userLevel, experience, onLevelUp }: GameConfiguratorProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalXP, setTotalXP] = useState(experience)
  const [showPersonalInfo, setShowPersonalInfo] = useState(false)

  const [paymentStep, setPaymentStep] = useState<"form" | "register" | "payment" | "processing">("form")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])

  const [formData, setFormData] = useState({
    firstName: "Juan Carlos",
    lastName: "Rodríguez",
    email: "juan.rodriguez@miempresa.com",
    company: "Innovación Digital SAS",
    acceptTerms: false,
    acceptEmails: false,
  })

  const [registrationData, setRegistrationData] = useState({
    email: "admin@miempresa.com",
    password: "SystemGen2024!",
    confirmPassword: "SystemGen2024!",
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: "4242 4242 4242 4242",
    expiryDate: "12/28",
    cvv: "123",
    cardName: "Juan Carlos Rodríguez",
  })

  const templates = [
    {
      id: "crm",
      name: "Sistema CRM",
      description: "Gestión completa de clientes y ventas",
      basePrice: 199,
      xp: 100,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      description: "Tienda online completa con pagos",
      basePrice: 299,
      xp: 150,
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "management",
      name: "Gestión Empresarial",
      description: "ERP completo para tu empresa",
      basePrice: 399,
      xp: 200,
      icon: Database,
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "custom",
      name: "Sistema Personalizado",
      description: "Construye desde cero tu solución",
      basePrice: 99,
      xp: 250,
      icon: Settings,
      color: "from-orange-500 to-red-500",
    },
  ]

  const modules: SystemModule[] = [
    {
      id: "auth",
      name: "Autenticación Avanzada",
      description: "Login social, 2FA, roles de usuario",
      price: 49,
      xp: 50,
      icon: Users,
      category: "security",
      unlocked: true,
      selected: false,
    },
    {
      id: "payments",
      name: "Pagos Online",
      description: "Stripe, PayPal, criptomonedas",
      price: 79,
      xp: 75,
      icon: DollarSign,
      category: "commerce",
      unlocked: true,
      selected: false,
    },
    {
      id: "analytics",
      name: "Analytics Avanzado",
      description: "Dashboard con métricas en tiempo real",
      price: 59,
      xp: 60,
      icon: Target,
      category: "insights",
      unlocked: userLevel >= 2,
      selected: false,
    },
    {
      id: "ai-chatbot",
      name: "Chatbot IA",
      description: "Asistente inteligente 24/7",
      price: 99,
      xp: 100,
      icon: Sparkles,
      category: "ai",
      unlocked: userLevel >= 2,
      selected: false,
    },
    {
      id: "mobile-app",
      name: "App Móvil",
      description: "iOS y Android nativas",
      price: 199,
      xp: 150,
      icon: Rocket,
      category: "mobile",
      unlocked: userLevel >= 3,
      selected: false,
    },
  ]

  useEffect(() => {
    const template = templates.find((t) => t.id === selectedTemplate)
    const modulePrice = selectedModules.reduce((sum, moduleId) => {
      const module = modules.find((m) => m.id === moduleId)
      return sum + (module?.price || 0)
    }, 0)

    setTotalPrice((template?.basePrice || 0) + modulePrice)
  }, [selectedTemplate, selectedModules])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      const newXP = totalXP + template.xp
      setTotalXP(newXP)

      if (newXP >= userLevel * 100) {
        onLevelUp(userLevel + 1, newXP)
      }
    }
    setCurrentStep(2)
  }

  const handleModuleToggle = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId)
    if (!module?.unlocked) return

    if (selectedModules.includes(moduleId)) {
      setSelectedModules((prev) => prev.filter((id) => id !== moduleId))
    } else {
      setSelectedModules((prev) => [...prev, moduleId])
      const newXP = totalXP + module.xp
      setTotalXP(newXP)

      if (newXP >= userLevel * 100) {
        onLevelUp(userLevel + 1, newXP)
      }
    }
  }

  const validateForm = () => {
    const errors: string[] = []
    if (!formData.firstName.trim()) errors.push("El nombre es requerido")
    if (!formData.lastName.trim()) errors.push("El apellido es requerido")
    if (!formData.email.trim()) errors.push("El email es requerido")
    if (!formData.company.trim()) errors.push("El nombre de la empresa es requerido")
    if (!formData.acceptTerms) errors.push("Debes aceptar los términos de servicio")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push("El email no tiene un formato válido")
    }

    setFormErrors(errors)
    return errors.length === 0
  }

  const validateRegistration = () => {
    const errors: string[] = []
    if (!registrationData.email.trim()) errors.push("El email es requerido")
    if (!registrationData.password) errors.push("La contraseña es requerida")
    if (registrationData.password.length < 8) errors.push("La contraseña debe tener al menos 8 caracteres")
    if (registrationData.password !== registrationData.confirmPassword) {
      errors.push("Las contraseñas no coinciden")
    }

    setFormErrors(errors)
    return errors.length === 0
  }

  const validatePaymentForm = () => {
    const errors: string[] = []
    if (!paymentData.cardNumber.replace(/\s/g, "")) errors.push("El número de tarjeta es requerido")
    if (!paymentData.expiryDate) errors.push("La fecha de vencimiento es requerida")
    if (!paymentData.cvv) errors.push("El CVV es requerido")
    if (!paymentData.cardName.trim()) errors.push("El nombre en la tarjeta es requerido")

    const cardNumber = paymentData.cardNumber.replace(/\s/g, "")
    if (cardNumber && cardNumber.length !== 16) {
      errors.push("El número de tarjeta debe tener 16 dígitos")
    }

    if (paymentData.cvv && paymentData.cvv.length !== 3) {
      errors.push("El CVV debe tener 3 dígitos")
    }

    setFormErrors(errors)
    return errors.length === 0
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors.length > 0) {
      setFormErrors([])
    }
  }

  const handleRegistrationChange = (field: string, value: string) => {
    setRegistrationData((prev) => ({ ...prev, [field]: value }))
    if (formErrors.length > 0) {
      setFormErrors([])
    }
  }

  const handlePaymentChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      if (formatted.replace(/\s/g, "").length <= 16) {
        setPaymentData((prev) => ({ ...prev, [field]: formatted }))
      }
    } else if (field === "expiryDate") {
      const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
      if (formatted.length <= 5) {
        setPaymentData((prev) => ({ ...prev, [field]: formatted }))
      }
    } else if (field === "cvv") {
      const formatted = value.replace(/\D/g, "").slice(0, 3)
      setPaymentData((prev) => ({ ...prev, [field]: formatted }))
    } else {
      setPaymentData((prev) => ({ ...prev, [field]: value }))
    }

    if (formErrors.length > 0) {
      setFormErrors([])
    }
  }

  const proceedToPayment = () => {
    if (!validateForm()) return
    setPaymentStep("register")
  }

  const proceedToPaymentFromRegistration = async () => {
    if (!validateRegistration()) return

    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      localStorage.setItem("userRegistered", "true")
      localStorage.setItem("userEmail", registrationData.email)
      setPaymentStep("payment")
    } catch (error) {
      setFormErrors(["Error al crear la cuenta. Por favor intenta nuevamente."])
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayment = async () => {
    if (!validatePaymentForm()) return

    setIsProcessing(true)
    setPaymentStep("processing")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      localStorage.setItem("paymentCompleted", "true")
      localStorage.setItem(
        "customerData",
        JSON.stringify({
          ...formData,
          registeredEmail: registrationData.email,
          template: templates.find((t) => t.id === selectedTemplate)?.name,
          modules: selectedModules,
          totalPaid: totalPrice + 499,
          paymentDate: new Date().toISOString(),
        }),
      )

      window.location.href = "/portal?welcome=true&payment=success"
    } catch (error) {
      setFormErrors(["Error al procesar el pago. Por favor intenta nuevamente."])
      setPaymentStep("payment")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeploy = () => {
    setShowPersonalInfo(true)
  }

  const handleContinueToRegistration = () => {
    router.push("/configurator")
  }

  const progressPercentage = ((currentStep - 1) / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold">Configurador Interactivo</span>
                  <div className="text-xs text-muted-foreground">
                    Nivel {userLevel} • {totalXP} XP
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">${totalPrice}</div>
                <div className="text-xs text-muted-foreground">Precio Total</div>
              </div>

            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso del Juego</span>
              <span className="text-sm text-muted-foreground">Paso {currentStep} de 3</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Template Selection */}
        {currentStep === 1 && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-primary text-white border-primary">
                <Star className="w-4 h-4 mr-2" />
                Paso 1: Selecciona tu Base
              </Badge>
              <h1 className="text-4xl font-bold mb-4">¿Qué Sistema Quieres Construir?</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Elige tu plantilla base y comienza a ganar XP. Cada selección desbloquea nuevas funcionalidades.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => {
                const Icon = template.icon
                return (
                  <Card
                    key={template.id}
                    className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${template.color}`}></div>

                    <CardHeader className="pb-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-center">{template.name}</CardTitle>
                      <CardDescription className="text-center">{template.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="text-center">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="text-2xl font-bold">${template.basePrice}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Gift className="w-4 h-4 text-accent" />
                          <span className="text-sm">+{template.xp} XP</span>
                        </div>
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        Seleccionar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Module Selection */}
        {currentStep === 2 && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-accent text-white border-accent">
                <Settings className="w-4 h-4 mr-2" />
                Paso 2: Personaliza tu Sistema
              </Badge>
              <h1 className="text-4xl font-bold mb-4">Agrega Módulos Poderosos</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Selecciona los módulos que necesitas. Algunos se desbloquean al subir de nivel.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const Icon = module.icon
                const isSelected = selectedModules.includes(module.id)

                return (
                  <Card
                    key={module.id}
                    className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${!module.unlocked
                      ? "opacity-50 cursor-not-allowed"
                      : isSelected
                        ? "border-2 border-primary shadow-lg bg-primary/5"
                        : "hover:shadow-lg border-2 hover:border-primary/30"
                      }`}
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    {!module.unlocked && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Nivel {module.category === "ai" || module.category === "insights" ? 2 : 3}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                            }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        {isSelected && <CheckCircle className="w-6 h-6 text-primary" />}
                      </div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-bold">${module.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-accent" />
                          <span className="text-sm">+{module.xp} XP</span>
                        </div>
                      </div>

                      {module.unlocked ? (
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          className={`w-full ${isSelected ? "bg-primary hover:bg-primary/90 text-white" : ""}`}
                        >
                          {isSelected ? (
                            <>
                              <Minus className="w-4 h-4 mr-2" />
                              Remover
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Agregar
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button variant="ghost" className="w-full" disabled>
                          🔒 Bloqueado
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" onClick={() => setCurrentStep(3)} className="bg-primary hover:bg-primary/90 text-white">
                Continuar al Resumen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Final Summary */}
        {currentStep === 3 && !showPersonalInfo && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-primary text-white border-primary">
                <Trophy className="w-4 h-4 mr-2" />
                Paso 3: ¡Listo para Desplegar!
              </Badge>
              <h1 className="text-4xl font-bold mb-4">Tu Sistema Está Listo</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Revisa tu configuración final y procede con el despliegue automático.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Configuration Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuración Final
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Template */}
                  {selectedTemplate && (
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <div>
                        <div className="font-medium">{templates.find((t) => t.id === selectedTemplate)?.name}</div>
                        <div className="text-sm text-muted-foreground">Plantilla base</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${templates.find((t) => t.id === selectedTemplate)?.basePrice}</div>
                      </div>
                    </div>
                  )}

                  {/* Selected Modules */}
                  {selectedModules.map((moduleId) => {
                    const module = modules.find((m) => m.id === moduleId)
                    if (!module) return null

                    return (
                      <div key={moduleId} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                        <div>
                          <div className="font-medium">{module.name}</div>
                          <div className="text-sm text-muted-foreground">Módulo adicional</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${module.price}</div>
                        </div>
                      </div>
                    )
                  })}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deployment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Información de Despliegue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Infraestructura automática</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">SSL y dominio incluidos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Backup automático diario</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Soporte 24/7 incluido</span>
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Tiempo estimado de despliegue:</div>
                    <div className="text-2xl font-bold text-primary">15 minutos</div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 shadow-lg text-white"
                    onClick={handleDeploy}
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    ¡Desplegar Mi Sistema!
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentStep === 3 && showPersonalInfo && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4 bg-accent text-slate-800 border-accent">
                <Sparkles className="w-4 h-4 mr-2" />
                {paymentStep === "form"
                  ? "Finalizar Configuración"
                  : paymentStep === "register"
                    ? "Crear tu Cuenta"
                    : paymentStep === "payment"
                      ? "Información de Pago"
                      : "Procesando Pago"}
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                {paymentStep === "form"
                  ? "Completa tus Datos"
                  : paymentStep === "register"
                    ? "Crea tu Cuenta de Acceso"
                    : paymentStep === "payment"
                      ? "Información de Pago"
                      : "Procesando tu Pago"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {paymentStep === "form"
                  ? "Último paso para desplegar tu sistema personalizado."
                  : paymentStep === "register"
                    ? "Crea tu cuenta para acceder al portal de cliente."
                    : paymentStep === "payment"
                      ? "Ingresa los datos de tu tarjeta para completar la compra."
                      : "No cierres esta ventana mientras procesamos tu pago."}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* System Summary - Always visible */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de tu Sistema</CardTitle>
                  <CardDescription>
                    Configuración personalizada para{" "}
                    {templates.find((t) => t.id === selectedTemplate)?.name || "Sistema Personalizado"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTemplate && (
                    <div className="flex justify-between items-center">
                      <span>Plantilla base ({templates.find((t) => t.id === selectedTemplate)?.name})</span>
                      <span className="font-semibold">
                        ${templates.find((t) => t.id === selectedTemplate)?.basePrice}/mes
                      </span>
                    </div>
                  )}

                  {selectedModules.map((moduleId) => {
                    const module = modules.find((m) => m.id === moduleId)
                    if (!module) return null
                    return (
                      <div key={moduleId} className="flex justify-between items-center text-sm">
                        <span>{module.name}</span>
                        <span>${module.price}/mes</span>
                      </div>
                    )
                  })}

                  <Separator />

                  <div className="flex justify-between items-center font-semibold">
                    <span>Total mensual:</span>
                    <span className="text-primary">${totalPrice}/mes</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Setup inicial (una vez):</span>
                    <span>$499</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total primer mes:</span>
                    <span className="text-primary">${totalPrice + 499}</span>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Pago 100% Seguro</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Procesado por PayPal • Encriptación SSL • PCI DSS Compliant
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Form Card */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {paymentStep === "form"
                      ? "Información Personal"
                      : paymentStep === "register"
                        ? "Registro de Cuenta"
                        : paymentStep === "payment"
                          ? "Información de Pago"
                          : "Procesando..."}
                  </CardTitle>
                  <CardDescription>
                    {paymentStep === "form"
                      ? "Completa tus datos para continuar"
                      : paymentStep === "register"
                        ? "Crea tu cuenta de acceso al sistema"
                        : paymentStep === "payment"
                          ? "Procesamiento seguro con PayPal"
                          : "No cierres esta ventana"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formErrors.length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <p className="text-sm font-medium text-destructive mb-2">
                        Por favor corrige los siguientes errores:
                      </p>
                      <ul className="text-sm text-destructive space-y-1">
                        {formErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {paymentStep === "form" && (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Datos de Prueba Precargados</span>
                        </div>
                        <p className="text-xs text-green-700">
                          Los campos están prellenados con información de prueba válida
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Nombre</label>
                          <Input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Apellido</label>
                          <Input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            placeholder="Tu apellido"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Email corporativo</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="tu@empresa.com"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Usaremos este email para comunicaciones importantes
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Empresa</label>
                        <Input
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder="Nombre de tu empresa"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="acceptTerms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                          />
                          <label htmlFor="acceptTerms" className="text-sm text-foreground leading-relaxed">
                            Acepto los términos y condiciones y la política de privacidad
                          </label>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="acceptEmails"
                            checked={formData.acceptEmails}
                            onCheckedChange={(checked) => handleInputChange("acceptEmails", checked as boolean)}
                          />
                          <label htmlFor="acceptEmails" className="text-sm text-foreground leading-relaxed">
                            Quiero recibir actualizaciones y ofertas especiales por email
                          </label>
                        </div>
                      </div>

                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Información Protegida</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Tus datos personales están protegidos con encriptación SSL y nunca serán compartidos con
                          terceros.
                        </p>
                      </div>

                      <Button className="w-full" size="lg" onClick={proceedToPayment} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Validando...
                          </>
                        ) : (
                          <>
                            Continuar al Registro
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {paymentStep === "register" && (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Datos de Prueba Precargados</span>
                        </div>
                        <p className="text-xs text-green-700">
                          Los campos están prellenados con credenciales de prueba válidas
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Email de la cuenta</label>
                        <Input
                          type="email"
                          value={registrationData.email}
                          onChange={(e) => handleRegistrationChange("email", e.target.value)}
                          placeholder="tu@empresa.com"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Este será tu email de acceso al portal</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Contraseña</label>
                        <Input
                          type="password"
                          value={registrationData.password}
                          onChange={(e) => handleRegistrationChange("password", e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Confirmar contraseña</label>
                        <Input
                          type="password"
                          value={registrationData.confirmPassword}
                          onChange={(e) => handleRegistrationChange("confirmPassword", e.target.value)}
                          placeholder="Repite tu contraseña"
                        />
                      </div>

                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Cuenta Segura</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Tu cuenta será creada con encriptación de extremo a extremo. Podrás acceder al portal
                          inmediatamente después del pago.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setPaymentStep("form")} className="flex-1">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Volver
                        </Button>
                        <Button
                          className="flex-1"
                          size="lg"
                          onClick={proceedToPaymentFromRegistration}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creando cuenta...
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 mr-2" />
                              Crear Cuenta y Continuar
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}

                  {paymentStep === "payment" && (
                    <>

                      {/*
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Número de Tarjeta</label>
                        <Input
                          type="text"
                          value={paymentData.cardNumber}
                          onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Tarjeta de prueba Visa (4242 4242 4242 4242)
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Fecha de Vencimiento</label>
                          <Input
                            type="text"
                            value={paymentData.expiryDate}
                            onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
                            placeholder="MM/YY"
                            className="font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">CVV</label>
                          <Input
                            type="text"
                            value={paymentData.cvv}
                            onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                            placeholder="123"
                            className="font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Nombre en la Tarjeta</label>
                        <Input
                          type="text"
                          value={paymentData.cardName}
                          onChange={(e) => handlePaymentChange("cardName", e.target.value)}
                          placeholder="Nombre como aparece en la tarjeta"
                        />
                      </div>
                      */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Datos de Prueba</span>
                        </div>
                        <p className="text-xs text-blue-700">
                          Tarjeta: 4461713437359120<br />
                          Fecha de expiración: 03/2030<br />
                          CVV: 123
                        </p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Información Segura</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Todos los datos son procesados de forma segura por PayPal. No almacenamos información de
                          tarjetas de crédito.
                        </p>
                      </div>
                      {/*
                      <div className="flex gap-3">
                        
                        <Button className="flex-1" size="lg" onClick={handlePayment} disabled={isProcessing}>
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Pagar ${totalPrice + 499}
                            </>
                          )}
                        </Button>
                      </div>
                      */}
                      <p className="text-xs text-center text-muted-foreground">
                        Tu sistema estará listo en menos de 1 minuto después del pago confirmado
                      </p>
                      {!isProcessing && <div>
                        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string, locale: "es_PE" }}>
                          <PayPalButtons fundingSource="card"
                            onClick={(data, actions) => {
                              //setto.setTerminos(false);
                              //contexto.general.setSubmitting(true);
                              return actions.resolve();
                            }}
                            onCancel={(data, actions) => {
                              //setto.setTerminos(true);
                              //contexto.general.setSubmitting(false);
                              return actions.redirect()
                            }}
                            createOrder={(_, actions) => {
                              return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [{
                                  amount: {
                                    currency_code: "USD",
                                    value: (totalPrice).toFixed(2)
                                  },
                                }],
                                application_context: {
                                  shipping_preference: "NO_SHIPPING", // Oculta dirección completa
                                },
                                payer: {
                                }
                              })
                            }}
                            onApprove={(_, actions) => {
                              if (!actions || !actions.order) return Promise.resolve();
                              return actions.order.capture().then(details => {
                                handlePayment()
                                console.log(details)
                              })
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>}
                      <Button variant="outline" onClick={() => setPaymentStep("register")} className="flex-1">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                      </Button>
                    </>
                  )}

                  {paymentStep === "processing" && (
                    <div className="text-center py-8">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                      <h3 className="text-lg font-semibold mb-2">Procesando tu pago...</h3>
                      <p className="text-sm text-muted-foreground">
                        Estamos configurando tu sistema. No cierres esta ventana.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
