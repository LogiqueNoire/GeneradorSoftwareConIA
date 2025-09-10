import type { Articulo } from "./types"

// Simple in-memory data store for articles
const articulos: Articulo[] = [
  {
    id: 1,
    titulo: "Configuración de Sistema SaaS",
    contenido: "Guía completa para configurar tu sistema SaaS personalizado...",
    fechaCreacion: new Date("2024-01-15"),
    fechaActualizacion: new Date("2024-01-15"),
  },
  {
    id: 2,
    titulo: "Mejores Prácticas de Gamificación",
    contenido: "Cómo implementar elementos de juego en tu aplicación empresarial...",
    fechaCreacion: new Date("2024-01-20"),
    fechaActualizacion: new Date("2024-01-20"),
  },
  {
    id: 3,
    titulo: "Integración de Pagos",
    contenido: "Configuración paso a paso para integrar pagos en tu sistema...",
    fechaCreacion: new Date("2024-01-25"),
    fechaActualizacion: new Date("2024-01-25"),
  },
]

export class ArticuloRepository {
  static async findAll(): Promise<Articulo[]> {
    return articulos
  }

  static async findById(id: number): Promise<Articulo | null> {
    return articulos.find((a) => a.id === id) || null
  }

  static async create(data: Omit<Articulo, "id" | "fechaCreacion" | "fechaActualizacion">): Promise<Articulo> {
    const newArticulo: Articulo = {
      id: Math.max(...articulos.map((a) => a.id)) + 1,
      ...data,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }
    articulos.push(newArticulo)
    return newArticulo
  }

  static async update(id: number, data: Partial<Omit<Articulo, "id" | "fechaCreacion">>): Promise<Articulo | null> {
    const index = articulos.findIndex((a) => a.id === id)
    if (index === -1) return null

    articulos[index] = {
      ...articulos[index],
      ...data,
      fechaActualizacion: new Date(),
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
