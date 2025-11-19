import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Config } from '../../config/config';
import { LogModel } from '../models/log.model';
import { CuentaCobroModel } from '../models/cuenta-cobro.model';
import { ClienteModel } from '../models/cliente.model';
import { ClientePaqueteModel } from '../models/cliente-paquete.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: Config.dbDialect,
      host: Config.dbHost,
      port: Config.dbPuerto,
      username: Config.dbUsuario,
      password: Config.dbContrasena,
      database: Config.dbBaseDatos,
      models: [
        LogModel,
        CuentaCobroModel,
        ClienteModel,
        ClientePaqueteModel,
      ],
      logging: Config.dbLogging,
      define: {
        underscored: true,
      },
    }),
  ],
})
export class DatabaseModule {}

