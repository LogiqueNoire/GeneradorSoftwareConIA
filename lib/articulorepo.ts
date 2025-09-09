import { connectDB } from "./db";
import { Articulo } from "./entity/Articulo";

export async function crearArticulo(data: {
  tag: string[];
  title: string;
  subtitle?: string | null;
  author: string;
  publishDate: Date;
  readTime: number;
  content: string;
}) {
  const db = await connectDB();
  const repo = db.getRepository(Articulo);
  const art = repo.create(data);
  return await repo.save(art);
}

export async function listarArticulos() {
  const db = await connectDB();
  const repo = db.getRepository(Articulo);
  return await repo.find({ order: { publishDate: "DESC" } });
}
