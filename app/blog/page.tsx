"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Calendar, Clock, User, Zap } from "lucide-react"
import Link from "next/link"
import { GET } from "../api/articulos/route"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Article {
  id: string
  title: string
  subtitle: string
  tag: string
  read_time: string
  publish_date: string
  author: string
  featured: boolean
}

function timeSince(date: Date): String {
  let now = new Date()
  let seconds = Math.floor((now.getTime()-date.getTime())/1000)
  if(seconds < 60)
    return "Hace " + seconds + " segundo" + (Math.trunc(seconds) != 1 ? "s" : '')
  if(seconds < 3600)
    return "Hace " + Math.trunc(seconds/60) + " minuto" + (Math.trunc(seconds/60) != 1 ? "s" : '')
  if(seconds < 3600 * 24)
    return "Hace " + Math.trunc(seconds/3600) + " hora" + (Math.trunc(seconds/3600) != 1 ? "s" : '')
  if(seconds < 3600 * 24 * 7)
    return "Hace " + Math.trunc(seconds/(3600*24)) + " día" + (Math.trunc(seconds/(3600 *24)) != 1 ? "s" : '')
  if(seconds < 3600 * 24 * 30)
    return "Hace " + Math.trunc(seconds/(3600*24*7)) + " semana" + (Math.trunc(seconds/(3600 * 24 * 7)) != 1 ? "s" : '')
  if(seconds < 3600 * 24 * 30 * 12)
    return "Hace " + Math.trunc(seconds/(3600*24*7*30)) + "mes" + (Math.trunc(seconds/(3600 * 24 * 7 *30)) != 1 ? "es" : '')

  return "Hace " + Math.trunc(seconds/(3600*24*30*12)) + "año" + (Math.trunc(seconds/(3600 * 24 * 7 * 12)) != 1 ? "s" : '')
}

export default function BlogPage() {

  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>()

  const startGame = () => {
    router.push("/?start=true")
  }

  useEffect(() => {
    fetch("/api/articulos")
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error("Error cargando artículos", err))
  }, [])

  useEffect(()=>{
    console.log(articles)
  }, [articles])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SystemGen</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            <User className="w-4 h-4 mr-2" />
            Contenido Generado por IA
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Blog de Automatización
            <span className="text-primary block">y Sistemas Inteligentes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Artículos y guías generadas automáticamente por IA para ayudarte a entender cómo la automatización puede
            transformar tu negocio.
          </p>
            <Button size="lg" className="text-lg px-8" onClick={()=>{startGame()}}>
              Configurar Mi Sistema
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Artículos Destacados</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {articles?.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">
                    {post.tag}
                  </Badge>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <CardDescription className="text-pretty">{post.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.read_time + " minutos"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {timeSince(new Date(post.publish_date))}
                    </div>
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                      Leer Artículo
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Todos los Artículos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles?.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">
                    {post.tag}
                  </Badge>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <CardDescription className="text-pretty">{post.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.read_time + " minutos"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {timeSince(new Date(post.publish_date))}
                    </div>
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                      Leer Artículo
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">¿Listo para Implementar Estas Soluciones?</CardTitle>
              <CardDescription className="text-lg">
                Configura tu sistema personalizado en minutos y comienza a automatizar tu negocio hoy mismo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/configurator">
                  <Button size="lg" className="text-lg px-8">
                    Configurar Mi Sistema
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                    Ya Tengo Cuenta
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SystemGen</span>
            </Link>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Inicio
              </Link>
              <Link href="/configurator" className="hover:text-foreground transition-colors">
                Configurador
              </Link>
              <Link href="/support" className="hover:text-foreground transition-colors">
                Soporte
              </Link>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 SystemGen. Contenido generado automáticamente por IA para atraer tráfico cualificado.
          </div>
        </div>
      </footer>
    </div>
  )
}
