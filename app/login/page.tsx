"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">SystemGen</h1>
          </div>
          <p className="text-slate-600">Accede con tu cuenta</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede con tu cuenta de Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Link href="/api/auth/signin/google?callbackUrl=/portal">
              <Button
                type="button"
                className="w-full h-11 text-left justify-start gap-3 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                <span className="text-xl">🌐</span>
                Continuar con Google
              </Button>
            </Link>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                ¿No tienes cuenta?{" "}
                <Link href="/configurator" className="text-primary hover:text-primary/80 font-medium">
                  Crear cuenta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">© 2024 SystemGen. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
