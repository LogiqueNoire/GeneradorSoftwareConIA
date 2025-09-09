import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Articulo } from "@/lib/entity/Articulo";

// POST /api/articulos
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const db = await connectDB();
    const repo = db.getRepository(Articulo);

    const articulo = repo.create({
      tag: body.tag ?? [],
      title: body.title,
      subtitle: body.subtitle,
      author: body.author,
      publishDate: new Date(body.publishDate),
      readTime: body.readTime,
      content: body.content,
    });

    const saved = await repo.save(articulo);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/articulos
export async function GET() {
  try {
    const db = await connectDB();
    const repo = db.getRepository(Articulo);
    const articulos = await repo.find({ order: { publishDate: "DESC" } });
    return NextResponse.json(articulos);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
