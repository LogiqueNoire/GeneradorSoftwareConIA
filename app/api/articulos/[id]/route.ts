import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import type { CreateArticleRequest } from "@/lib/types"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const [article] = await sql`
      SELECT id, title, subtitle, content, tag, publish_date, read_time, created_at, updated_at
      FROM articles
      WHERE id = ${id}
    `

    if (!article) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body: CreateArticleRequest = await request.json()
    const { title, subtitle, content, tag, read_time } = body

    const [updatedArticle] = await sql`
      UPDATE articles
      SET title = ${title}, subtitle = ${subtitle || null}, content = ${content}, 
          tag = ${tag || null}, read_time = ${read_time || 5}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, subtitle, content, tag, publish_date, read_time, created_at, updated_at
    `

    if (!updatedArticle) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const [deletedArticle] = await sql`
      DELETE FROM articles
      WHERE id = ${id}
      RETURNING id
    `

    if (!deletedArticle) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Artículo eliminado correctamente" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
