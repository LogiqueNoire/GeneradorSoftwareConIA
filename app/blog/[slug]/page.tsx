import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Calendar, Clock, User, Zap } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const blogPosts = {
  "chatbot-dentistas-aumenta-citas": {
    title: "Cómo el Chatbot para Dentistas Aumenta las Citas un 30%",
    subtitle:
      "Descubre cómo la automatización inteligente puede transformar la gestión de citas en tu clínica dental",
    tag: "Automatización",
    readTime: "5 min",
    publishDate: "15 de Enero, 2024",
    author: "IA SystemGen",
    content: `
      <h2>La Revolución de los Chatbots en Clínicas Dentales</h2>
      <p>Los chatbots especializados para clínicas dentales están transformando la manera en que los pacientes programan y gestionan sus citas. Según estudios recientes, las clínicas que implementan sistemas automatizados de gestión de citas ven un aumento promedio del 30% en sus reservas.</p>
      
      <h3>Beneficios Clave de la Automatización</h3>
      <ul>
        <li><strong>Disponibilidad 24/7:</strong> Los pacientes pueden agendar citas en cualquier momento</li>
        <li><strong>Reducción de cancelaciones:</strong> Recordatorios automáticos reducen las ausencias en un 40%</li>
        <li><strong>Optimización de horarios:</strong> IA inteligente maximiza la ocupación de slots disponibles</li>
        <li><strong>Mejor experiencia del paciente:</strong> Proceso de reserva más rápido y conveniente</li>
      </ul>

      <h3>Implementación Práctica</h3>
      <p>La implementación de un chatbot para clínicas dentales incluye integración con sistemas de gestión existentes, personalización de flujos de conversación específicos para servicios dentales, y configuración de recordatorios automáticos.</p>

      <blockquote>
        "Desde que implementamos el chatbot, nuestras citas aumentaron 35% y las cancelaciones se redujeron a la mitad" - Dr. María González, Clínica Dental Sonrisa
      </blockquote>

      <h3>ROI y Métricas de Éxito</h3>
      <p>Las clínicas que implementan chatbots ven resultados medibles en los primeros 30 días:</p>
      <ul>
        <li>30% más citas programadas</li>
        <li>40% menos cancelaciones</li>
        <li>60% reducción en tiempo administrativo</li>
        <li>95% satisfacción del paciente</li>
      </ul>
    `,
  },
  "automatizar-facturacion-ecommerce": {
    title: "5 Pasos para Automatizar la Facturación en tu E-commerce",
    subtitle: "Guía completa para implementar facturación automática y reducir errores manuales en tu tienda online",
    tag: "E-commerce",
    readTime: "7 min",
    publishDate: "10 de Enero, 2024",
    author: "IA SystemGen",
    content: `
      <h2>Automatización de Facturación: La Clave del E-commerce Exitoso</h2>
      <p>La facturación manual es una de las principales fuentes de errores y pérdida de tiempo en e-commerce. La automatización no solo reduce errores sino que mejora significativamente el flujo de caja y la experiencia del cliente.</p>
      
      <h3>Paso 1: Integración con Pasarelas de Pago</h3>
      <p>Conecta tu sistema de facturación directamente con procesadores de pago como Stripe, PayPal o MercadoPago. Esto permite generar facturas automáticamente cuando se completa una transacción.</p>

      <h3>Paso 2: Configuración de Plantillas Inteligentes</h3>
      <p>Crea plantillas de factura que se adapten automáticamente según el tipo de producto, cliente, o región. Incluye cálculos automáticos de impuestos y descuentos.</p>

      <h3>Paso 3: Automatización de Envíos</h3>
      <p>Configura el envío automático de facturas por email inmediatamente después de la compra, con opciones de personalización según el segmento de cliente.</p>

      <h3>Paso 4: Seguimiento y Recordatorios</h3>
      <p>Implementa sistemas de seguimiento automático para facturas pendientes, con recordatorios escalonados y opciones de pago flexibles.</p>

      <h3>Paso 5: Reportes y Analytics</h3>
      <p>Genera reportes automáticos de facturación, análisis de flujo de caja, y métricas de cobranza para tomar decisiones informadas.</p>

      <h3>Beneficios Medibles</h3>
      <ul>
        <li>85% reducción en errores de facturación</li>
        <li>70% menos tiempo administrativo</li>
        <li>45% mejora en tiempo de cobro</li>
        <li>90% satisfacción del cliente</li>
      </ul>
    `,
  },
  "crm-personalizado-roi-400": {
    title: "Sistema CRM Personalizado: ROI del 400% en 6 Meses",
    subtitle: "Caso de estudio real: cómo una empresa logró 400% de ROI implementando un CRM automatizado",
    tag: "CRM",
    readTime: "8 min",
    publishDate: "12 de Enero, 2024",
    author: "IA SystemGen",
    content: `
      <h2>Caso de Estudio: TechSolutions Inc.</h2>
      <p>TechSolutions Inc., una empresa de servicios tecnológicos con 50 empleados, implementó un CRM personalizado que transformó completamente su proceso de ventas y atención al cliente, logrando un ROI del 400% en solo 6 meses.</p>
      
      <h3>Situación Inicial</h3>
      <p>Antes de la implementación, TechSolutions enfrentaba:</p>
      <ul>
        <li>Pérdida del 30% de leads por falta de seguimiento</li>
        <li>Procesos de venta desorganizados</li>
        <li>Información de clientes dispersa en múltiples sistemas</li>
        <li>Tiempo excesivo en tareas administrativas</li>
      </ul>

      <h3>Solución Implementada</h3>
      <p>El CRM personalizado incluyó:</p>
      <ul>
        <li><strong>Automatización de leads:</strong> Captura y distribución automática</li>
        <li><strong>Pipeline inteligente:</strong> Seguimiento automático de oportunidades</li>
        <li><strong>Comunicación unificada:</strong> Historial completo de interacciones</li>
        <li><strong>Reportes en tiempo real:</strong> Métricas de ventas y rendimiento</li>
      </ul>

      <h3>Resultados en 6 Meses</h3>
      <div class="results-grid">
        <div class="metric">
          <h4>Conversión de Leads</h4>
          <p>De 15% a 45% (+200%)</p>
        </div>
        <div class="metric">
          <h4>Tiempo de Cierre</h4>
          <p>De 45 días a 20 días (-55%)</p>
        </div>
        <div class="metric">
          <h4>Retención de Clientes</h4>
          <p>De 70% a 92% (+31%)</p>
        </div>
        <div class="metric">
          <h4>Productividad del Equipo</h4>
          <p>+60% en actividades de venta</p>
        </div>
      </div>

      <h3>Cálculo del ROI</h3>
      <p><strong>Inversión inicial:</strong> $25,000 USD</p>
      <p><strong>Beneficios en 6 meses:</strong></p>
      <ul>
        <li>Aumento en ventas: $85,000</li>
        <li>Reducción de costos operativos: $15,000</li>
        <li>Mejora en retención: $25,000</li>
        <li><strong>Total de beneficios: $125,000</strong></li>
      </ul>
      <p><strong>ROI = (125,000 - 25,000) / 25,000 × 100 = 400%</strong></p>

      <blockquote>
        "El CRM personalizado no solo mejoró nuestras ventas, sino que transformó completamente nuestra cultura organizacional hacia la orientación al cliente" - Carlos Mendoza, CEO TechSolutions Inc.
      </blockquote>
    `,
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

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
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Blog
            </Button>
          </Link>
        </div>
      </header>

      {/* Article Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">{post.title}</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">{post.description}</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.publishDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime} de lectura
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto text-center max-w-2xl">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">¿Te Interesa Implementar Esta Solución?</CardTitle>
              <CardDescription className="text-lg">
                Configura tu sistema personalizado en minutos y comienza a ver resultados como los descritos en este
                artículo.
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
                <Link href="/blog">
                  <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                    Leer Más Artículos
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
