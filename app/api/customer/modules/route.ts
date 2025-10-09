import { NextRequest, NextResponse } from 'next/server'
import { ModulesService } from '@/lib/modules-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const customerId = session.user.email // Usando email como customer_id por ahora
    const purchasedModules = await ModulesService.getPurchasedModulesByCustomer(customerId)
    
    return NextResponse.json({ 
      success: true, 
      purchasedModules,
      moduleIds: purchasedModules.map(pm => pm.module_id)
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchased modules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId, status, paymentReference } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

    await ModulesService.updateOrderPaymentStatus(orderId, status, paymentReference)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update payment status' },
      { status: 500 }
    )
  }
}