import type { Article } from "./types"

// Simple in-memory data store for articles
export const articulos: Article[] = [
  {
    id: 1,
    title: "Configuración de Sistema SaaS",
    content: "Guía completa para configurar tu sistema SaaS personalizado...",
    publish_date: "2024-01-15",
    read_time: 5,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Mejores Prácticas de Gamificación",
    content: "Cómo implementar elementos de juego en tu aplicación empresarial...",
    publish_date: "2024-01-20",
    read_time: 8,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 3,
    title: "Integración de Pagos",
    content: "Configuración paso a paso para integrar pagos en tu sistema...",
    publish_date: "2024-01-25",
    read_time: 12,
    created_at: "2024-01-25T10:00:00Z",
    updated_at: "2024-01-25T10:00:00Z",
  },
]

export class ArticuloRepository {
  static async findAll(): Promise<Article[]> {
    return articulos
  }

  static async findById(id: number): Promise<Article | null> {
    return articulos.find((a) => a.id === id) || null
  }

  static async create(data: Omit<Article, "id" | "created_at" | "updated_at">): Promise<Article> {
    const newArticulo: Article = {
      id: Math.max(...articulos.map((a) => a.id)) + 1,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    articulos.push(newArticulo)
    return newArticulo
  }

  static async update(id: number, data: Partial<Omit<Article, "id" | "created_at">>): Promise<Article | null> {
    const index = articulos.findIndex((a) => a.id === id)
    if (index === -1) return null

    articulos[index] = {
      ...articulos[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return articulos[index]
  }

  static async delete(id: number): Promise<boolean> {
    const index = articulos.findIndex((a) => a.id === id)
    if (index === -1) return false

    articulos.splice(index, 1)
    return true
  }
}
