import { AppDataSource } from "./datasource"

export async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
  return AppDataSource
}
