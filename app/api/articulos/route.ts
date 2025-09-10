import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import type { CreateArticleRequest } from "@/lib/types"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const articles = await sql`
      SELECT id, title, subtitle, content, tag, publish_date, read_time, created_at, updated_at
      FROM articles
      ORDER BY publish_date DESC
    `
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateArticleRequest = await request.json()
    const { title, subtitle, content, tag, read_time = 5 } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title y content son requeridos" }, { status: 400 })
    }

    const [newArticle] = await sql`
      INSERT INTO articles (title, subtitle, content, tag, read_time)
      VALUES (${title}, ${subtitle || null}, ${content}, ${tag || null}, ${read_time})
      RETURNING id, title, subtitle, content, tag, publish_date, read_time, created_at, updated_at
    `

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
