import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { OrderService } from '@/lib/database'

export async function POST(request: Request) {
  try {
    // Obtener la sesión del usuario autenticado
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      customerInfo, 
      selectedModules, 
      totalAmount, 
      paymentMethod, 
      paymentReference 
    } = body

    // Guardar orden en base de datos usando el email de la sesión como customer_id
    const result = await OrderService.createOrder({
      customerId: session.user.email, // Usar el email de la sesión autenticada
      customerInfo,
      selectedModules,
      totalAmount,
      paymentMethod,
      paymentReference
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      order: result.order
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al crear la orden' },
      { status: 500 }
    )
  }
}