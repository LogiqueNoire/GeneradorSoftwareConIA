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
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: CreateArticleRequest
    const contentType = request.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      body = await request.json()
    } else if (
      contentType?.includes("application/x-www-form-urlencoded") ||
      contentType?.includes("multipart/form-data")
    ) {
      const formData = await request.formData()
      body = {
        title: formData.get("title") as string,
        subtitle: formData.get("subtitle") as string,
        content: formData.get("content") as string,
        tag: formData.get("tag") as string,
        read_time: formData.get("read_time") ? Number.parseInt(formData.get("read_time") as string) : 5,
      }
    } else {
      return NextResponse.json(
        { error: "Content-Type no soportado. Use application/json o form data" },
        { status: 400 },
      )
    }

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
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
