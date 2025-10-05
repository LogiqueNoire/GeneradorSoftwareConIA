import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { UserService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' }, 
        { status: 401 }
      );
    }

    // Obtener datos del usuario desde la base de datos
    const user = await UserService.getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' }, 
        { status: 404 }
      );
    }

    // Actualizar último acceso
    await UserService.updateLastLogin(user.id);

    // Devolver datos del usuario (sin información sensible)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      picture_url: user.picture_url,
      tour_completed: user.tour_completed,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
    });

  } catch (error) { 
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
