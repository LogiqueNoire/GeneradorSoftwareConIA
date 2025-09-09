import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Calendar, Clock, User, Zap } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  const blogPosts = [
    {
      id: "chatbot-dentistas-aumenta-citas",
      title: "Cómo el Chatbot para Dentistas Aumenta las Citas un 30%",
      subtitle:
        "Descubre cómo la automatización inteligente puede transformar la gestión de citas en tu clínica dental, reduciendo cancelaciones y optimizando horarios.",
      tag: "Automatización",
      readTime: "5 min",
      publishDate: "Hace 2 días",
      author: "IA SystemGen",
      featured: true,
    },
    {
      id: "automatizar-facturacion-ecommerce",
      title: "5 Pasos para Automatizar la Facturación en tu E-commerce",
      subtitle:
        "Guía completa para implementar facturación automática y reducir errores manuales en tu tienda online, mejorando el flujo de caja.",
      category: "E-commerce",
      readTime: "7 min",
      publishDate: "Hace 1 semana",
      author: "IA SystemGen",
      featured: true,
    },
    {
      id: "crm-personalizado-roi-400",
      title: "Sistema CRM Personalizado: ROI del 400% en 6 Meses",
      subtitle:
        "Caso de estudio real: cómo una empresa logró 400% de ROI implementando un CRM automatizado con seguimiento inteligente.",
      tag: "CRM",
      readTime: "8 min",
      publishDate: "Hace 3 días",
      author: "IA SystemGen",
      featured: true,
    },
    {
      id: "automatizacion-restaurantes-pedidos",
      title: "Automatización de Pedidos: Restaurantes Aumentan Ventas 45%",
      subtitle:
        "Cómo los sistemas automatizados de pedidos están revolucionando la industria gastronómica y mejorando la experiencia del cliente.",
      tag: "Restaurantes",
      readTime: "6 min",
      publishDate: "Hace 5 días",
      author: "IA SystemGen",
      featured: false,
    },
    {
      id: "sistema-inventario-inteligente",
      title: "Sistema de Inventario Inteligente: Reduce Costos 25%",
      subtitle:
        "Implementa un sistema de inventario que predice demanda y optimiza stock automáticamente, reduciendo costos operativos.",
      tag: "Inventario",
      readTime: "9 min",
      publishDate: "Hace 1 semana",
      author: "IA SystemGen",
      featured: false,
    },
    {
      id: "chatbot-soporte-24-7",
      title: "Chatbot de Soporte 24/7: Satisfacción del Cliente al 95%",
      subtitle:
        "Descubre cómo implementar un sistema de soporte automatizado que resuelve el 80% de consultas sin intervención humana.",
      tag: "Soporte",
      readTime: "4 min",
      publishDate: "Hace 4 días",
      author: "IA SystemGen",
      featured: false,
    },
  ]

  const featuredPosts = blogPosts.filter((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

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
          <Link href="/configurator">
            <Button size="lg" className="text-lg px-8">
              Configurar Mi Sistema
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Artículos Destacados</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {featuredPosts.map((post) => (
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
                      {post.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.publishDate}
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
            {regularPosts.map((post) => (
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
                      {post.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.publishDate}
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
