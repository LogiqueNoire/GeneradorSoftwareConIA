import { Articulo } from "./entity/Articulo";

export const AppDataSource = new DataSource({
  /* ... */
  entities: [Articulo /*, otras entidades */],
  synchronize: true, // solo en desarrollo
});
