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
    const { configurations } = body

    // Guardar configuraciones en la base de datos
    const result = await OrderService.saveModuleConfigurations(session.user.email, configurations)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Configuraciones guardadas exitosamente'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al guardar las configuraciones' },
      { status: 500 }
    )
  }
}