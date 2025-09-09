import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "articulos" })
export class Articulo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  tag!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  subtitulo?: string | null;

  @Column({ type: "varchar", length: 120 })
  author!: string;

  @Column({ type: "timestamptz" })
  publishDate!: Date;

  @Column({ type: "int", name: "tiempo_lectura" })
  readTime!: number;

  // texto completo del artículo
  @Column({ type: "text" })
  content!: string;

  // timestamps para auditoría
  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt!: Date;
}
