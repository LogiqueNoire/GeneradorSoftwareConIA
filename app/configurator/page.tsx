"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Minus,
  Zap,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
  Shield,
  Database,
  Mail,
  Phone,
  ShoppingCart,
  Users,
  Loader2,
  Lock,
  User,
  Bot,
  X,
  Send,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

interface Module {
  id: string
  name: string
  description: string
  icon: any
  monthlyPrice: number
  category: string
}

interface Template {
  id: string
  name: string
  description: string
  icon: any
  monthlyPrice: number
  includedModules: string[]
}

const templates: Template[] = [
  {
    id: "dental-clinic",
    name: "Clínica Dental",
    description: "Sistema completo para gestión de citas, pacientes y facturación dental",
    icon: Calendar,
    monthlyPrice: 89,
    includedModules: ["appointments", "patients", "billing"],
  },
  {
    id: "ecommerce",
    name: "Tienda Online",
    description: "Plataforma e-commerce con pagos, inventario y análisis de ventas",
    icon: ShoppingCart,
    monthlyPrice: 129,
    includedModules: ["payments", "inventory", "analytics"],
  },
  {
    id: "consultancy",
    name: "Consultora",
    description: "CRM avanzado para gestión de clientes, proyectos y facturación",
    icon: Users,
    monthlyPrice: 79,
    includedModules: ["crm", "projects", "billing"],
  },
]

// Función para asignar iconos según categoría

export default function ConfiguratorPage() {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [totalMonthly, setTotalMonthly] = useState(0)
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoadingModules, setIsLoadingModules] = useState(true)
  const [userProfile, setUserProfile] = useState({
    name: "Juan Carlos",
    company: "Innovación Digital SAS",
    industry: "Tecnología",
    previousVisits: 3,
    lastConfiguration: "E-commerce Avanzado",
  })
  const [formData, setFormData] = useState({
    firstName: "Juan Carlos",
    lastName: "Rodríguez",
    email: "juan.rodriguez@miempresa.com",
    phone: "+57 300 123 4567",
    postalCode: "110111",
    acceptTerms: false,
    acceptEmails: false,
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "4242 4242 4242 4242",
    expiryDate: "12/28",
    cvv: "123",
    cardName: "Juan Carlos Rodríguez",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [paymentStep, setPaymentStep] = useState<"form" | "payment" | "processing">("form")
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")

  // Cargar módulos desde la base de datos
  useEffect(() => {
    const loadModules = async () => {
      try {
        setIsLoadingModules(true)
        const response = await fetch('/api/modules')
        const data = await response.json()
        
        if (data.success) {
          // Mapear los módulos de la BD al formato del configurador
          const mappedModules = data.modules.map((module: any) => ({
            id: module.id.replace('module_', ''), // Remover prefijo para compatibilidad
            name: module.name,
            description: module.description,
            icon: getModuleIcon(module.category), // Función para asignar iconos
            monthlyPrice: Number(module.monthly_price), // Convertir a número
            category: module.category,
          }))
          setModules(mappedModules)
        } else {
          setModules(getStaticModules())
        }
      } catch (error) {
        setModules(getStaticModules())
      } finally {
        setIsLoadingModules(false)
      }
    }

    loadModules()
  }, [])

  // Función para asignar iconos según categoría
  const getModuleIcon = (category: string) => {
    switch (category) {
      case 'core': return Calendar
      case 'ai': return MessageSquare
      case 'communication': return Phone
      case 'marketing': return Mail
      case 'finance': return CreditCard
      case 'healthcare': return Users
      case 'security': return Shield
      case 'infrastructure': return Database
      default: return BarChart3
    }
  }

  // Módulos estáticos como fallback
  const getStaticModules = (): Module[] => [
    {
      id: "appointments",
      name: "Agendamiento de Citas",
      description: "Sistema automatizado de reservas con confirmaciones por WhatsApp",
      icon: Calendar,
      monthlyPrice: 29,
      category: "core",
    },
    {
      id: "payments",
      name: "Pagos por WhatsApp",
      description: "Procesamiento de pagos integrado con mensajería",
      icon: CreditCard,
      monthlyPrice: 39,
      category: "core",
    },
    {
      id: "chatbot",
      name: "Chatbot IA",
      description: "Asistente virtual entrenado para tu industria",
      icon: MessageSquare,
      monthlyPrice: 49,
      category: "ai",
    },
    {
      id: "analytics",
      name: "Análisis de Sentimiento",
      description: "IA que analiza feedback de clientes automáticamente",
      icon: BarChart3,
      monthlyPrice: 59,
      category: "ai",
    },
  ]

  useEffect(() => {
    calculatePricing()
  }, [selectedTemplate, selectedModules])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 1 && !showChatbot) {
        setShowChatbot(true)
        setChatMessages([
          {
            role: "assistant",
            content: `¡Hola ${userProfile.name}! 👋 Veo que estás diseñando una nueva solución. Como cliente recurrente de ${userProfile.company}, puedo ayudarte a encontrar la configuración perfecta basada en tu experiencia previa con "${userProfile.lastConfiguration}". ¿Te gustaría que te guíe?`,
          },
        ])
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [step, showChatbot, userProfile])

  // Función para formatear precios
  const formatPrice = (price: number | string) => {
    const numPrice = Number(price) || 0
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice).replace('$', '')
  }

  const calculatePricing = () => {
    let monthly = Number(selectedTemplate?.monthlyPrice || 0)

    selectedModules.forEach((moduleId) => {
      const module = modules.find((m) => m.id === moduleId)
      if (module && !selectedTemplate?.includedModules.includes(moduleId)) {
        monthly += Number(module.monthlyPrice || 0)
      }
    })

    // Asegurar que el total sea un número válido
    setTotalMonthly(Math.round(monthly * 100) / 100) // Redondear a 2 decimales
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setSelectedModules([...template.includedModules])
    setStep(2)
  }

  const toggleModule = (moduleId: string) => {
    if (selectedTemplate?.includedModules.includes(moduleId)) return // Can't remove included modules

    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const isModuleIncluded = (moduleId: string) => {
    return selectedTemplate?.includedModules.includes(moduleId) || false
  }

  const isModuleSelected = (moduleId: string) => {
    return selectedModules.includes(moduleId)
  }

  const getModulesByCategory = (category: string) => {
    return modules.filter((module) => module.category === category)
  }

  const categories = [
    { id: "core", name: "Funcionalidades Core", description: "Módulos esenciales para tu negocio" },
    { id: "ai", name: "Inteligencia Artificial", description: "Automatización inteligente" },
    { id: "business", name: "Gestión Empresarial", description: "Herramientas de administración" },
    { id: "communication", name: "Comunicación", description: "Canales de contacto con clientes" },
    { id: "marketing", name: "Marketing", description: "Herramientas de promoción" },
    { id: "finance", name: "Finanzas", description: "Gestión financiera y facturación" },
    { id: "security", name: "Seguridad", description: "Protección y compliance" },
    { id: "infrastructure", name: "Infraestructura", description: "Servicios técnicos avanzados" },
    { id: "healthcare", name: "Salud", description: "Específico para sector salud" },
  ]

  const progress = (step / 3) * 100

  const validatePaymentForm = () => {
    const errors: string[] = []

    // Validate personal info
    if (!formData.firstName.trim()) errors.push("El nombre es requerido")
    if (!formData.lastName.trim()) errors.push("El apellido es requerido")
    if (!formData.email.trim()) errors.push("El email es requerido")
    if (!formData.phone.trim()) errors.push("El teléfono es requerido")
    if (!formData.postalCode.trim()) errors.push("El código postal es requerido")
    if (!formData.acceptTerms) errors.push("Debes aceptar los términos de servicio")

    // Validate payment info
    if (!paymentData.cardNumber.replace(/\s/g, "")) errors.push("El número de tarjeta es requerido")
    if (!paymentData.expiryDate) errors.push("La fecha de vencimiento es requerida")
    if (!paymentData.cvv) errors.push("El CVV es requerido")
    if (!paymentData.cardName.trim()) errors.push("El nombre en la tarjeta es requerido")

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push("El email no tiene un formato válido")
    }

    // Card number validation (basic)
    const cardNumber = paymentData.cardNumber.replace(/\s/g, "")
    if (cardNumber && cardNumber.length !== 16) {
      errors.push("El número de tarjeta debe tener 16 dígitos")
    }

    // CVV validation
    if (paymentData.cvv && paymentData.cvv.length !== 3) {
      errors.push("El CVV debe tener 3 dígitos")
    }

    setFormErrors(errors)
    return errors.length === 0
  }

  const validateForm = () => {
    const errors: string[] = []

    // Validate personal info
    if (!formData.firstName.trim()) errors.push("El nombre es requerido")
    if (!formData.lastName.trim()) errors.push("El apellido es requerido")
    if (!formData.email.trim()) errors.push("El email es requerido")
    if (!formData.phone.trim()) errors.push("El teléfono es requerido")
    if (!formData.postalCode.trim()) errors.push("El código postal es requerido")
    if (!formData.acceptTerms) errors.push("Debes aceptar los términos de servicio")

    setFormErrors(errors)
    return errors.length === 0
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors.length > 0) {
      setFormErrors([])
    }
  }

  const handlePaymentChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      // Format card number with spaces
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      if (formatted.replace(/\s/g, "").length <= 16) {
        setPaymentData((prev) => ({ ...prev, [field]: formatted }))
      }
    } else if (field === "expiryDate") {
      // Format expiry date MM/YY
      const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
      if (formatted.length <= 5) {
        setPaymentData((prev) => ({ ...prev, [field]: formatted }))
      }
    } else if (field === "cvv") {
      // Only allow 3 digits
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
    if (!validateForm()) {
      return
    }
    setPaymentStep("payment")
  }

  const handlePayment = async () => {
    if (!validatePaymentForm()) {
      return
    }

    setIsProcessing(true)
    setPaymentStep("processing")

    try {
      // Simulate Stripe payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate payment data processing
      const paymentPayload = {
        amount: totalMonthly * 100, // Stripe uses cents
        currency: "usd",
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          postalCode: formData.postalCode,
        },
        card: {
          number: paymentData.cardNumber.replace(/\s/g, ""),
          exp_month: paymentData.expiryDate.split("/")[0],
          exp_year: `20${paymentData.expiryDate.split("/")[1]}`,
          cvc: paymentData.cvv,
        },
        metadata: {
          template: selectedTemplate?.name,
          modules: selectedModules.join(","),
          monthly_price: totalMonthly,
          registered_email: formData.email,
        },
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Guardar orden en base de datos
      try {
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerInfo: {
              ...formData,
              registeredEmail: formData.email,
              template: selectedTemplate?.name,
            },
            selectedModules,
            totalAmount: totalMonthly,
            paymentMethod: 'stripe',
            paymentReference: 'stripe_payment_intent_demo'
          })
        });

        const orderData = await orderResponse.json();
      } catch (error) {
        console.error('[Payment] Error saving order:', error);
      }

      // Store payment success in localStorage for portal access
      localStorage.setItem("paymentCompleted", "true")
      localStorage.setItem(
        "customerData",
        JSON.stringify({
          ...formData,
          registeredEmail: formData.email,
          template: selectedTemplate?.name,
          modules: selectedModules,
          totalPaid: totalMonthly,
          paymentDate: new Date().toISOString(),
        }),
      )

      // Redirect to portal
      window.location.href = "/portal?welcome=true&payment=success"
    } catch (error) {
      console.error("[v0] Payment error:", error)
      setFormErrors(["Error al procesar el pago con Stripe. Por favor intenta nuevamente."])
      setPaymentStep("payment")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setChatInput("")
    setIsTyping(true)

    // Simulate AI response based on context
    setTimeout(() => {
      let response = ""

      if (userMessage.toLowerCase().includes("precio") || userMessage.toLowerCase().includes("costo")) {
        response = `Basándome en tu configuración actual, el precio mensual es $${totalMonthly}. Para ${userProfile.industry}, esto representa un ROI del 300% en promedio. ¿Te gustaría que ajuste algún módulo para optimizar el precio?`
      } else if (userMessage.toLowerCase().includes("recomend") || userMessage.toLowerCase().includes("suger")) {
        response = `Para ${userProfile.company} en el sector ${userProfile.industry}, recomiendo la plantilla E-commerce con módulos de IA y Analytics. Esto te dará un 40% más de conversiones. ¿Quieres que la configure automáticamente?`
      } else if (
        userMessage.toLowerCase().includes("sí") ||
        userMessage.toLowerCase().includes("si") ||
        userMessage.toLowerCase().includes("yes")
      ) {
        if (selectedTemplate) {
          response = `¡Perfecto! He optimizado tu configuración. El precio final es $${totalMonthly}/mes. Esta configuración es ideal para tus necesidades. ¿Procedemos con la orden?`
        } else {
          response = `¡Excelente! Te recomiendo empezar con la plantilla E-commerce Avanzado. Incluye todo lo que necesitas para tu industria. ¿La seleccionamos?`
        }
      } else {
        response = `Entiendo tu consulta sobre "${userMessage}". Como experto en soluciones para ${userProfile.industry}, puedo decirte que esta configuración te ayudará a aumentar tus ventas un 35% en promedio. ¿Hay algún módulo específico que te interese?`
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SystemGen</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Paso {step} de 3</div>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">Selecciona tu Plantilla Base</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Elige la plantilla que mejor se adapte a tu industria. Podrás personalizar los módulos en el siguiente
                  paso.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {templates.map((template) => {
                  const Icon = template.icon
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{template.name}</CardTitle>
                        <CardDescription className="text-center">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Precio mensual:</span>
                            <span className="font-semibold">${formatPrice(template.monthlyPrice)}/mes</span>
                          </div>
                          <Separator />
                          <div>
                            <p className="text-sm font-medium mb-2">Módulos incluidos:</p>
                            <div className="flex flex-wrap gap-1">
                              {template.includedModules.map((moduleId) => {
                                const module = modules.find((m) => m.id === moduleId)
                                return module ? (
                                  <Badge key={moduleId} variant="secondary" className="text-xs text-white">
                                    {module.name}
                                  </Badge>
                                ) : null
                              })}
                            </div>
                          </div>
                          <Button className="w-full group-hover:bg-primary/90 transition-colors">
                            Seleccionar Plantilla
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Module Selection */}
          {step === 2 && selectedTemplate && (
            <div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-4">Personaliza tu Sistema</h1>
                  <p className="text-xl text-muted-foreground">
                    Añade o quita módulos según tus necesidades. El precio se actualiza en tiempo real.
                  </p>
                </div>
                <Card className="w-80 sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <selectedTemplate.icon className="w-5 h-5" />
                      {selectedTemplate.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Precio mensual:</span>
                        <span className="text-2xl font-bold text-primary">${formatPrice(totalMonthly)}</span>
                      </div>
                      <Separator />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Total mensual:</p>
                        <p className="text-3xl font-bold text-foreground">${formatPrice(totalMonthly)}</p>
                      </div>
                      {totalMonthly > 200 && (
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                          <p className="text-sm text-accent-foreground font-medium mb-2 text-black">
                            🚀 Solución Enterprise Detectada
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            Parece que estás construyendo una solución potente. ¿Prefieres finalizar la compra o agendar
                            una llamada con nuestro arquitecto?
                          </p>
                          <Button variant="outline" size="sm" className="w-full mb-2 bg-transparent">
                            Agendar Llamada (15 min)
                          </Button>
                        </div>
                      )}
                      <Button className="w-full" onClick={() => setStep(3)}>
                        Continuar al Pago
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8 max-w-4xl">
                {isLoadingModules ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Cargando módulos disponibles...</h3>
                    <p className="text-muted-foreground">Obteniendo la información más actualizada desde la base de datos</p>
                  </div>
                ) : (
                  categories.map((category) => {
                    const categoryModules = getModulesByCategory(category.id)
                    if (categoryModules.length === 0) return null

                    return (
                      <div key={category.id}>
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-foreground mb-2">{category.name}</h2>
                          <p className="text-muted-foreground">{category.description}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {categoryModules.map((module) => {
                            const Icon = module.icon
                            const included = isModuleIncluded(module.id)
                            const selected = isModuleSelected(module.id)

                            return (
                              <Card
                                key={module.id}
                                className={`cursor-pointer transition-all duration-200 ${included
                                  ? "border-primary bg-primary/5"
                                  : selected
                                    ? "border-accent bg-accent/5"
                                    : "hover:shadow-md"
                                  }`}
                                onClick={() => !included && toggleModule(module.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                      <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${included ? "bg-primary/20" : selected ? "bg-accent/20" : "bg-muted"
                                          }`}
                                      >
                                        <Icon
                                          className={`w-5 h-5 ${included ? "text-primary" : selected ? "text-accent" : "text-muted-foreground"
                                            }`}
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h3 className="font-semibold text-foreground">{module.name}</h3>
                                          {included && (
                                            <Badge variant="default" className="text-xs">
                                              Incluido
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                                        <div className="flex items-center gap-4 text-sm">
                                          <span className="text-muted-foreground">${formatPrice(module.monthlyPrice)}/mes</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      {included ? (
                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                          <Check className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                      ) : (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="w-6 h-6 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            toggleModule(module.id)
                                          }}
                                        >
                                          {selected ? (
                                            <Minus className="w-4 h-4 text-destructive" />
                                          ) : (
                                            <Plus className="w-4 h-4 text-accent" />
                                          )}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {/* Step 3: Checkout */}
          {step === 3 && selectedTemplate && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {paymentStep === "form"
                    ? "Finalizar Configuración"
                    : paymentStep === "payment"
                      ? "Información de Pago"
                      : "Procesando Pago"}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {paymentStep === "form"
                    ? "Revisa tu configuración y completa tus datos."
                    : paymentStep === "payment"
                      ? "Ingresa los datos de tu tarjeta para completar la compra."
                      : "Procesando tu pago de forma segura..."}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen de tu Sistema</CardTitle>
                    <CardDescription>Configuración personalizada para {selectedTemplate.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Plantilla base ({selectedTemplate.name})</span>
                        <span>${formatPrice(selectedTemplate.monthlyPrice)}/mes</span>
                      </div>

                      {selectedModules
                        .filter((id) => !selectedTemplate.includedModules.includes(id))
                        .map((moduleId) => {
                          const module = modules.find((m) => m.id === moduleId)
                          return module ? (
                            <div key={moduleId} className="flex justify-between items-center">
                              <span>{module.name}</span>
                              <span>${formatPrice(module.monthlyPrice)}/mes</span>
                            </div>
                          ) : null
                        })}

                      <Separator />

                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total mensual:</span>
                        <span className="text-primary">${formatPrice(totalMonthly)}/mes</span>
                      </div>

                      <div className="bg-muted/30 p-4 rounded-lg mt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Pago 100% Seguro</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Procesado por Stripe • Encriptación SSL • PCI DSS Compliant
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form/Payment Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {paymentStep === "form"
                        ? "Información Personal"
                        : paymentStep === "payment"
                          ? "Información de Pago"
                          : "Procesando..."}
                    </CardTitle>
                    <CardDescription>
                      {paymentStep === "form"
                        ? "Completa tus datos para continuar"
                        : paymentStep === "payment"
                          ? "Procesamiento seguro con Stripe"
                          : "No cierres esta ventana"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentStep === "processing" ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                        <h3 className="text-lg font-semibold mb-2">Procesando tu pago...</h3>
                        <p className="text-muted-foreground mb-4">Estamos validando tu información con Stripe</p>
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            ⏱️ Tiempo estimado: 30-60 segundos
                            <br />🔒 Tu información está protegida
                            <br />✅ Tu sistema se activará automáticamente
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
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
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Email corporativo
                              </label>
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
                              <label className="text-sm font-medium text-foreground mb-2 block">Teléfono</label>
                              <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="+57 300 123 4567"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">Código Postal</label>
                              <Input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                placeholder="110111"
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
                                  Acepto los{" "}
                                  <a href="#" className="text-primary hover:underline">
                                    términos y condiciones
                                  </a>{" "}
                                  y la{" "}
                                  <a href="#" className="text-primary hover:underline">
                                    política de privacidad
                                  </a>
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
                                  Continuar al Pago
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </>
                        )}

                        {paymentStep === "payment" && (
                          <>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">Elige tu método de pago</span>
                              </div>
                              <p className="text-xs text-blue-700">
                                Pago 100% seguro con Stripe o PayPal
                              </p>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  paymentMethod === "stripe"
                                    ? "border-primary bg-primary/5"
                                    : "border-muted hover:border-primary/50"
                                }`}
                                onClick={() => setPaymentMethod("stripe")}
                              >
                                <div className="flex items-center gap-3">
                                  <CreditCard className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="font-medium text-sm">Tarjeta de Crédito</p>
                                    <p className="text-xs text-muted-foreground">Visa, MasterCard, American Express</p>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  paymentMethod === "paypal"
                                    ? "border-primary bg-primary/5"
                                    : "border-muted hover:border-primary/50"
                                }`}
                                onClick={() => setPaymentMethod("paypal")}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                                    P
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">PayPal</p>
                                    <p className="text-xs text-muted-foreground">Cuenta PayPal o tarjeta</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {paymentMethod === "stripe" ? (
                              <>
                                <div>
                                  <label className="text-sm font-medium text-foreground mb-2 block">
                                    Número de Tarjeta
                                  </label>
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
                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                      Fecha de Vencimiento
                                    </label>
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
                                  <label className="text-sm font-medium text-foreground mb-2 block">
                                    Nombre en la Tarjeta
                                  </label>
                                  <Input
                                    type="text"
                                    value={paymentData.cardName}
                                    onChange={(e) => handlePaymentChange("cardName", e.target.value)}
                                    placeholder="Nombre como aparece en la tarjeta"
                                  />
                                </div>

                                <div className="bg-muted/30 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lock className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium">Información Segura</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Todos los datos son procesados de forma segura por Stripe. No almacenamos información de
                                    tarjetas de crédito.
                                  </p>
                                </div>

                                <div className="flex gap-3">
                                  <Button variant="outline" onClick={() => setPaymentStep("form")} className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                  </Button>
                                  <Button className="flex-1" size="lg" onClick={handlePayment} disabled={isProcessing}>
                                    {isProcessing ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Procesando...
                                      </>
                                    ) : (
                                      <>
                                        <Lock className="w-4 h-4 mr-2" />
                                        Pagar ${formatPrice(totalMonthly)}
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="bg-muted/30 p-4 rounded-lg mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lock className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">Pago Seguro con PayPal</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Serás redirigido a PayPal para completar tu pago de forma segura. Puedes usar tu cuenta PayPal o pagar como invitado con tarjeta.
                                  </p>
                                </div>

                                <PayPalScriptProvider 
                                  options={{ 
                                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                                    currency: "USD",
                                    intent: "capture",
                                    locale: "es_PE"
                                  }}
                                >
                                  <PayPalButtons
                                    style={{
                                      layout: "vertical",
                                      color: "blue",
                                      shape: "rect",
                                      label: "pay"
                                    }}
                                    createOrder={(data, actions) => {
                                      return actions.order.create({
                                        intent: "CAPTURE",
                                        purchase_units: [
                                          {
                                            amount: {
                                              currency_code: "USD",
                                              value: totalMonthly.toString(),
                                            },
                                            description: `${selectedTemplate?.name} - Sistema personalizado`,
                                            custom_id: `order_${Date.now()}`,
                                          },
                                        ],
                                        application_context: {
                                          brand_name: "SystemGen",
                                          user_action: "PAY_NOW",
                                          shipping_preference: "NO_SHIPPING", // No pedir dirección de envío
                                          payment_method: {
                                            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED"
                                          }
                                        },
                                      });
                                    }}
                                    onApprove={async (data, actions) => {
                                      if (!actions.order) return;
                                      
                                      setIsProcessing(true);
                                      try {
                                        const details = await actions.order.capture();
                                        
                                        // Guardar orden en base de datos
                                        try {
                                          const orderResponse = await fetch('/api/orders', {
                                            method: 'POST',
                                            headers: {
                                              'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                              customerInfo: {
                                                ...formData,
                                                registeredEmail: formData.email,
                                                template: selectedTemplate?.name,
                                              },
                                              selectedModules,
                                              totalAmount: totalMonthly,
                                              paymentMethod: 'paypal',
                                              paymentReference: details.id || ''
                                            })
                                          });

                                          const orderData = await orderResponse.json();
                                        } catch (error) {
                                          console.error('[PayPal] Error saving order:', error);
                                        }
                                        
                                        // Store payment success in localStorage for portal access
                                        localStorage.setItem("paymentCompleted", "true");
                                        localStorage.setItem("paymentMethod", "paypal");
                                        localStorage.setItem("paypalOrderId", details.id || "");
                                        localStorage.setItem(
                                          "customerData",
                                          JSON.stringify({
                                            ...formData,
                                            registeredEmail: formData.email,
                                            template: selectedTemplate?.name,
                                            modules: selectedModules,
                                            totalPaid: totalMonthly,
                                            paymentDate: new Date().toISOString(),
                                            paymentMethod: "paypal",
                                            paypalOrderId: details.id || "",
                                          }),
                                        );

                                        // Redirect to portal
                                        setTimeout(() => {
                                          window.location.href = "/portal?welcome=true&payment=success&method=paypal";
                                        }, 1000);
                                        
                                      } catch (error) {
                                        console.error("[PayPal] Payment error:", error);
                                        setFormErrors(["Error al procesar el pago con PayPal. Por favor intenta nuevamente."]);
                                        setIsProcessing(false);
                                      }
                                    }}
                                    onError={(err) => {
                                      console.error("[PayPal] Error:", err);
                                      setFormErrors(["Error en el sistema de PayPal. Por favor intenta nuevamente."]);
                                    }}
                                    onCancel={(data) => {
                                      setFormErrors(["Pago cancelado. Puedes intentar nuevamente cuando gustes."]);
                                    }}
                                  />
                                </PayPalScriptProvider>

                                <div className="flex gap-3 mt-4">
                                  <Button variant="outline" onClick={() => setPaymentStep("form")} className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                  </Button>
                                </div>
                              </>
                            )}

                            <p className="text-xs text-center text-muted-foreground">
                              Tu sistema estará listo en menos de 1 minuto después del pago confirmado
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {paymentStep === "form" && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" onClick={() => setStep(2)} className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Módulos
                  </Button>
                </div>
              )}
            </div>
          )}
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
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
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
