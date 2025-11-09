import { NextRequest, NextResponse } from 'next/server'
import { ModulesService } from '@/lib/modules-service'

interface RouteParams {
  params: {
    moduleId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const items = await ModulesService.getModuleItems(params.moduleId)
    return NextResponse.json({ success: true, items })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch module items' },
      { status: 500 }
    )
  }
}