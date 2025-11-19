import { LogModel } from '../models/log.model';
import { Transformador } from '../../../utils/transformador.util';

export interface ICrearLog {
  datos: Record<string, any>;
  tipo: string;
}

export interface ILog {
  id: number;
  datos: Record<string, any>;
  tipo: string;
  fechaCreacion: Date;
}

export class LogRepository {
  static async crear(datos: ICrearLog): Promise<ILog> {
    const log = await LogModel.create({
      datos: datos.datos,
      tipo: datos.tipo,
      fechaCreacion: new Date(),
    });

    return Transformador.extraerDataValues<ILog>(log);
  }
}

