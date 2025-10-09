import { NextRequest, NextResponse } from 'next/server'
import { ModulesService } from '@/lib/modules-service'

export async function GET() {
  try {
    const modules = await ModulesService.getActiveModules()
    return NextResponse.json({ success: true, modules })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customer_id, modules, customer_info, payment_method } = await request.json()

    if (!customer_id || !modules || !Array.isArray(modules) || modules.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Calcular precio total
    const moduleData = await ModulesService.getActiveModules()
    const selectedModules = moduleData.filter(m => modules.includes(m.id))
    const totalAmount = selectedModules.reduce((total, module) => {
      return total + module.monthly_price + module.setup_price
    }, 0)

    const orderId = await ModulesService.createOrder({
      customer_id,
      total_amount: totalAmount,
      payment_method: payment_method || 'stripe',
      customer_info,
      modules
    })

    return NextResponse.json({ 
      success: true, 
      orderId,
      totalAmount,
      modules: selectedModules
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}