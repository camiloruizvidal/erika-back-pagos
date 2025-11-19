import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'logs',
  timestamps: false,
  paranoid: false,
})
export class LogModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.JSONB })
  declare datos: Record<string, any>;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare tipo: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'fecha_creacion' })
  declare fechaCreacion: Date;
}

