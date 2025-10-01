import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { UserService } from '@/lib/database';

// GET - Verificar estado del tour
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await UserService.getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      tourCompleted: user.tour_completed,
      shouldShowTour: !user.tour_completed,
      userId: user.id
    });
  } catch (error) { 
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Marcar tour como completado
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await UserService.getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const success = await UserService.markTourCompleted(user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update tour status' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Tour completed successfully',
      tourCompleted: true
    });
  } catch (error) { 
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}