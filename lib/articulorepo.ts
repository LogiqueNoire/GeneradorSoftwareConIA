import { connectDB } from "./db";
import { Articulo } from "./entity/Articulo";

export async function crearArticulo(data: {
  etiqueta: string[];
  titulo: string;
  subtitulo?: string | null;
  autor: string;
  fecha: Date;
  tiempoLectura: number;
  texto: string;
}) {
  const db = await connectDB();
  const repo = db.getRepository(Articulo);
  const art = repo.create(data);
  return await repo.save(art);
}

export async function listarArticulos() {
  const db = await connectDB();
  const repo = db.getRepository(Articulo);
  return await repo.find({ order: { fecha: "DESC" } });
}
