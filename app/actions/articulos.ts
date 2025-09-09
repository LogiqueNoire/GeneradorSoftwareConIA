"use server";

import { crearArticulo, listarArticulos } from "@/lib/article.repo";

export async function actionCrearArticulo(payload: {
  tag: string[];
  title: string;
  subtitle?: string | null;
  author: string;
  readTime: string; // o Date
  readTime: number;
  content: string;
}) {
  // si recibes fecha como string, conviértela a Date
  const fecha = new Date(payload.fecha);
  return await crearArticulo({ ...payload, fecha });
}

export async function actionListarArticulos() {
  return await listarArticulos();
}
