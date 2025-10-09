import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { UserService } from '@/lib/database'

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

    // Obtener los datos completos del usuario desde la tabla users
    const user = await UserService.getUserByEmail(session.user.email)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado en la base de datos' },
        { status: 404 }
      )
    }

    // Devolver datos del usuario sin información sensible
    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      given_name: user.given_name,
      family_name: user.family_name,
      picture_url: user.picture_url,
      company: user.company,
      department: user.department,
      role: user.role,
      status: user.status,
      created_at: user.created_at,
      last_login_at: user.last_login_at
    }

    return NextResponse.json({
      success: true,
      user: userProfile
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener perfil de usuario' },
      { status: 500 }
    )
  }
}