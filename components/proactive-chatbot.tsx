"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User, Target, DollarSign, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ProactiveChatbotProps {
  isVisible: boolean
  onClose: () => void
  userLevel: number
}

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export function ProactiveChatbot({ isVisible, userLevel, onClose }: ProactiveChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const proactiveMessages = [
    {
      trigger: "initial",
      content:
        "¡Hola! 👋 Veo que estás explorando nuestro configurador. Soy tu asistente IA y estoy aquí para ayudarte a encontrar la configuración perfecta para tu negocio. ¿Te gustaría que te ayude?",
      suggestions: ["Sí, ayúdame a elegir", "¿Qué me recomiendas?", "Tengo dudas sobre precios"],
    },
    {
      trigger: "template_selection",
      content:
        "Excelente elección de plantilla! Basándome en tu selección, puedo recomendarte algunos módulos que funcionan perfectamente juntos. ¿Te interesa ver mis sugerencias personalizadas?",
      suggestions: ["Ver recomendaciones", "¿Cuál es más popular?", "Mostrar precios"],
    },
    {
      trigger: "pricing_question",
      content:
        "Veo que estás revisando los precios. Te tengo buenas noticias: como cliente nuevo, tienes acceso a un descuento del 20% en tu primer mes. ¿Te gustaría que calculemos el precio final con el descuento?",
      suggestions: ["Calcular con descuento", "¿Hay más ofertas?", "Proceder con la orden"],
    },
  ]

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setTimeout(() => {
        const initialMessage: Message = {
          id: "1",
          type: "bot",
          content: proactiveMessages[0].content,
          timestamp: new Date(),
          suggestions: proactiveMessages[0].suggestions,
        }
        setMessages([initialMessage])
        setIsOpen(true)
      }, 1000)
    }
  }, [isVisible])

  const handleSendMessage = async (content: string) => {
  if (!content.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: "user",
    content,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsTyping(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    });

    const data = await response.json();
    const botMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: data.reply || "No obtuve respuesta, intenta de nuevo.",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    const errorMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: "Ocurrió un error al conectar con la IA.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};


  const generateBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()

    let response = ""
    let suggestions: string[] = []

    if (input.includes("precio") || input.includes("costo") || input.includes("descuento")) {
      response =
        "Perfecto! Veo que te interesa el tema de precios. Actualmente tienes seleccionado un sistema que cuesta $299. Con nuestro descuento de bienvenida del 20%, quedaría en $239. Además, incluye hosting gratuito por 3 meses. ¿Te parece bien proceder con esta configuración?"
      suggestions = ["Sí, proceder", "¿Puedo personalizar más?", "¿Hay planes de pago?"]
    } else if (input.includes("recomend") || input.includes("suger") || input.includes("ayuda")) {
      response =
        "¡Excelente! Basándome en tu nivel actual y las tendencias de nuestros clientes exitosos, te recomiendo agregar el módulo de Analytics Avanzado (+$59) y el Chatbot IA (+$99). Estos dos módulos juntos aumentan la retención de clientes en un 40%. ¿Te interesa agregarlos?"
      suggestions = ["Agregar ambos", "Solo Analytics", "Ver más opciones"]
    } else if (input.includes("popular") || input.includes("mejor") || input.includes("exitoso")) {
      response =
        "¡Gran pregunta! El 78% de nuestros clientes más exitosos eligen la combinación de CRM + Chatbot IA + Analytics. Esta configuración les ha generado un ROI promedio del 340% en los primeros 6 meses. ¿Te gustaría que configure esta combinación ganadora para ti?"
      suggestions = ["Sí, configurar", "Ver estadísticas", "Personalizar más"]
    } else {
      response =
        "Entiendo tu consulta. Como tu asistente especializado, puedo ayudarte a optimizar tu configuración para maximizar el ROI de tu inversión. ¿Te gustaría que analice tu industria específica para darte recomendaciones más precisas?"
      suggestions = ["Analizar mi industria", "Ver configuración actual", "Hablar con experto"]
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      content: response,
      timestamp: new Date(),
      suggestions,
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Chatbot Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-xl animate-pulse text-white"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] shadow-2xl border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Asistente IA</CardTitle>
                  <CardDescription className="text-white/80 text-sm">Especialista en configuraciones</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[400px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] ${
                      message.type === "user" ? "bg-primary text-white" : "bg-muted text-foreground"
                    } rounded-lg p-3`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === "bot" && <Bot className="w-4 h-4 mt-0.5 text-primary" />}
                      {message.type === "user" && <User className="w-4 h-4 mt-0.5" />}
                      <div className="text-sm">{message.content}</div>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.type === "bot" && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full text-xs justify-start bg-background/50 hover:bg-primary/10"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            <ArrowRight className="w-3 h-3 mr-2" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <div className="flex gap-1">
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

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleSendMessage("¿Cuál es el mejor precio?")}
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  Precios
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleSendMessage("Recomiéndame módulos")}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Recomendaciones
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
