import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { OrderService } from '@/lib/database'

export async function GET(request: Request) {
  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email

    // Obtener compras desde la base de datos
    const result = await OrderService.getUserPurchases(userEmail)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Si no hay datos, devolver null (no mostrar módulos)
    if (!result.data) {
      return NextResponse.json({
        success: true,
        data: null
      })
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener las compras' },
      { status: 500 }
    )
  }
}