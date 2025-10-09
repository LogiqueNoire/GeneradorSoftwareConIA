import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { OrderService } from '@/lib/database'

export async function GET(request: Request) {
  try {
    // Obtener la sesión del usuario autenticado
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // Cargar configuraciones desde la base de datos
    const result = await OrderService.getUserPurchases(session.user.email)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Convertir las configuraciones al formato esperado por el frontend
    const configurations: any = {}
    
    if (result.data?.moduleConfigurations) {
      for (const moduleConfig of result.data.moduleConfigurations) {
        const items: any = {}
        
        for (const item of moduleConfig.items) {
          items[item.id] = {
            value: item.value,
            completed: item.completed
          }
        }
        
        configurations[moduleConfig.moduleId] = {
          items
        }
      }
    }

    return NextResponse.json({
      success: true,
      configurations
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al cargar las configuraciones' },
      { status: 500 }
    )
  }
}