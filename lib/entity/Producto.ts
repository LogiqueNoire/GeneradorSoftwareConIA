import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  @Column("text")
  descripcion: string

  @Column("decimal", { precision: 10, scale: 2 })
  precio: number

  @Column({ default: true })
  activo: boolean

  @Column()
  categoria: string

  @CreateDateColumn()
  fechaCreacion: Date

  @UpdateDateColumn()
  fechaActualizacion: Date
}
