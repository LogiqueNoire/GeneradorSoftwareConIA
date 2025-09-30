import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login')
    const isPublicPage = ['/', '/blog', '/support'].some(path => 
      req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path)
    ) 
    // Permitir acceso a páginas públicas sin autenticación
    if (isPublicPage && !isAuthPage) { 
      return NextResponse.next()
    }

    // Redirigir a login si no está autenticado y trata de acceder a páginas protegidas
    if (!isAuth && !isAuthPage && !isPublicPage) { 
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    // Redirigir a portal si ya está autenticado y trata de acceder a login
    if (isAuth && isAuthPage) { 
      return NextResponse.redirect(new URL('/portal', req.url))
    }
 
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acceso a páginas públicas
        const isPublicPage = ['/', '/blog', '/support'].some(path => 
          req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path)
        )
        
        if (isPublicPage) {
          return true
        }

        // Para páginas protegidas, verificar que hay token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}