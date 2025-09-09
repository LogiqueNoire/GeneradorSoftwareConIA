"use server";

import { crearArticulo, listarArticulos } from "@/lib/article.repo";

export async function actionCrearArticulo(payload: {
  etiqueta: string[];
  titulo: string;
  subtitulo?: string | null;
  autor: string;
  fecha: string; // o Date
  tiempoLectura: number;
  texto: string;
}) {
  // si recibes fecha como string, conviértela a Date
  const fecha = new Date(payload.fecha);
  return await crearArticulo({ ...payload, fecha });
}

export async function actionListarArticulos() {
  return await listarArticulos();
}
