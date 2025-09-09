import { Articulo } from "./entity/Articulo"
import { Producto } from "./entity/Producto"

import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // ej: "postgresql://user:password@localhost:5432/mi_db"
  ssl: { rejectUnauthorized: false },
  synchronize: true,
  logging: false,
  entities: [Articulo, Producto],
})
