import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("Variable MAKE_WEBHOOK_URL no definida en .env.local");
    }

    const makeResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await makeResponse.json();

    return NextResponse.json({ reply: data.reply || "No se recibió respuesta de la IA." });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json({ error: "Error procesando la solicitud" }, { status: 500 });
  }
}
