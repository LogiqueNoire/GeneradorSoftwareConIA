"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  Zap,
  Cog,
  CheckCircle,
  Star,
  Trophy,
  Target,
  MessageCircle,
  Sparkles,
  Play,
  Crown,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { GameConfigurator } from "@/components/game-configurator"
import { ProactiveChatbot } from "@/components/proactive-chatbot"

export default function HomePage() {
  const [gameStarted, setGameStarted] = useState(false)
  const [userLevel, setUserLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatbot(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <GameConfigurator
          onBack={() => setGameStarted(false)}
          userLevel={userLevel}
          experience={experience}
          onLevelUp={(newLevel, newExp) => {
            setUserLevel(newLevel)
            setExperience(newExp)
          }}
        />
        <ProactiveChatbot isVisible={showChatbot} onClose={() => setShowChatbot(false)} userLevel={userLevel} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Gamified Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">SystemGen</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Crown className="w-3 h-3" />
                <span>Nivel {userLevel}</span>
              </div>
            </div>
          </div>

          {/* Experience Bar */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">{experience} XP</span>
            </div>
            <Progress value={experience % 100} className="w-24" />
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <Trophy className="w-4 h-4 mr-2" />
                Mi Progreso
              </Button>
            </Link>
            <Button
              onClick={() => setGameStarted(true)}
              className="bg-primary hover:bg-primary/90 shadow-lg text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              ¡Empezar Juego!
            </Button>
          </div>
        </div>

        <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-6">
              <Link href="/blog">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                >
                  Blog
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/intranet">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                >
                  Intranet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Game Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-primary/20 rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-primary/10 text-slate-800 rounded-full border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">¡Experiencia Gamificada!</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Construye tu Sistema
            </span>
            <span className="block text-foreground">Como un Videojuego</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Configura, personaliza y despliega tu sistema empresarial en una experiencia interactiva.
            <strong className="text-foreground"> Gana XP, desbloquea funciones y ve tu precio en tiempo real.</strong>
          </p>

          {/* Game Stats Preview */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border">
              <div className="text-2xl font-bold text-primary">15+</div>
              <div className="text-xs text-muted-foreground">Módulos</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border">
              <div className="text-2xl font-bold text-accent">5</div>
              <div className="text-xs text-muted-foreground">Niveles</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border">
              <div className="text-2xl font-bold text-primary">∞</div>
              <div className="text-xs text-muted-foreground">Posibilidades</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 bg-primary hover:bg-primary/90 shadow-xl transform hover:scale-105 transition-all duration-200 text-white"
              onClick={() => setGameStarted(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              ¡Comenzar Aventura!
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-card/50 backdrop-blur-sm border-primary/30 hover:bg-primary/5"
            >
              <Target className="w-5 h-5 mr-2" />
              Ver Demo Interactiva
            </Button>
          </div>
        </div>
      </section>

      {/* Game Features */}
      <section className="py-20 px-4 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">¿Cómo Funciona el Juego?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Una experiencia única donde construir tu sistema empresarial es tan divertido como un videojuego.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Level 1 */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/20">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary text-white border-primary">
                    Nivel Principiante
                  </Badge>
                </div>
                <CardTitle className="text-xl">Selecciona tu Plantilla Base</CardTitle>
                <CardDescription>Elige entre CRM, E-commerce, Gestión o Sistema Personalizado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Gift className="w-4 h-4 text-primary" />
                    <span>+50 XP por selección</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Desbloquea módulos básicos</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level 2 */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-accent/20">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-accent">2</span>
                  </div>
                  <Badge variant="secondary" className="bg-accent text-white border-accent">
                    Nivel Intermedio
                  </Badge>
                </div>
                <CardTitle className="text-xl">Personaliza tu Sistema</CardTitle>
                <CardDescription>Configura módulos, integraciones y funcionalidades avanzadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Gift className="w-4 h-4 text-accent" />
                    <span>+100 XP por módulo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Precio dinámico en tiempo real</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level 3 */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/20">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="bg-primary text-white border-primary">
                    Nivel Maestro
                  </Badge>
                </div>
                <CardTitle className="text-xl">¡Sistema Desplegado!</CardTitle>
                <CardDescription>Tu sistema se crea automáticamente y queda listo para usar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Gift className="w-4 h-4 text-primary" />
                    <span>+500 XP por completar</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-accent" />
                    <span>Logro: "Constructor Maestro"</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Vista Previa Interactiva</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mira cómo se ve la experiencia de configuración gamificada.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl">
              <div className="bg-slate-100 dark:bg-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Cog className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold">Configurador Interactivo</span>
                  </div>
                  <Badge className="bg-accent text-white border-accent">Demo Mode</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">Nivel 2</div>
                    <div className="text-xs text-muted-foreground">Tu Progreso</div>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-accent">$299</div>
                    <div className="text-xs text-muted-foreground">Precio Actual</div>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">7/12</div>
                    <div className="text-xs text-muted-foreground">Módulos</div>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-accent">85%</div>
                    <div className="text-xs text-muted-foreground">Completado</div>
                  </div>
                </div>

                <Progress value={85} className="mb-4" />

                <div className="text-center">
                  <Button
                    onClick={() => setGameStarted(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-white border-0 shadow-lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    ¡Probar Ahora!
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-accent/10 text-slate-800 rounded-full border border-accent/20">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">¡Experiencia Única!</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              ¿Listo para la Aventura de
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                Crear tu Sistema?
              </span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Únete a cientos de empresarios que ya han transformado sus negocios jugando con nuestro configurador
              interactivo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="text-lg px-8 bg-primary hover:bg-primary/90 shadow-xl transform hover:scale-105 transition-all duration-200 text-white"
                onClick={() => setGameStarted(true)}
              >
                <Play className="w-5 h-5 mr-2" />
                ¡Comenzar Aventura Gratis!
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-card/50 backdrop-blur-sm border-primary/30 hover:bg-primary/5"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Hablar con Experto
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Setup en 15 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">SystemGen</span>
                <div className="text-xs text-muted-foreground">Gamified Business Solutions</div>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Soporte
              </a>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 SystemGen. La primera plataforma gamificada para crear sistemas empresariales.
          </div>
        </div>
      </footer>

      {/* Proactive Chatbot */}
      <ProactiveChatbot isVisible={showChatbot} onClose={() => setShowChatbot(false)} userLevel={userLevel} />
    </div>
  )
}
