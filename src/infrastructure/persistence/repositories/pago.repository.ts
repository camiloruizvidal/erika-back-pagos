import { CuentaCobroModel } from '../models/cuenta-cobro.model';
import { ClienteModel } from '../models/cliente.model';
import { ClientePaqueteModel } from '../models/cliente-paquete.model';
import { EEstadoCuentaCobro } from '../../../domain/enums/estado-cuenta-cobro.enum';
import { Transformador } from '../../../utils/transformador.util';
import { IResultadoFindAndCount } from '../../../shared/interfaces/sequelize-find.interface';

export interface IPagoListado {
  id: number;
  cliente_id: number;
  nombre_cliente: string;
  correo_cliente: string;
  identificacion_cliente: string | null;
  fecha_cobro: Date;
  valor_total: number;
  fecha_pago: Date | null;
  valor_pagado: number | null;
  tiene_pdf_pago: boolean;
}

export class PagoRepository {
  static async listarPagosPaginados(
    tenantId: number,
    offset: number,
    limit: number,
    clientePaqueteId: number,
  ): Promise<IResultadoFindAndCount<IPagoListado>> {
    const resultado = await CuentaCobroModel.findAndCountAll({
      where: {
        tenantId,
        estado: EEstadoCuentaCobro.PAGADA,
        clientePaqueteId,
      },
      include: [
        {
          model: ClienteModel,
          as: 'cliente',
          attributes: [
            'id',
            'primerNombre',
            'segundoNombre',
            'primerApellido',
            'segundoApellido',
            'nombreCompleto',
            'correo',
            'identificacion',
          ],
          required: true,
        },
        {
          model: ClientePaqueteModel,
          as: 'clientePaquete',
          attributes: ['id', 'paqueteOriginalId'],
          required: true,
        },
      ],
      offset,
      limit,
      order: [
        ['fechaPago', 'DESC'],
        ['id', 'DESC'],
      ],
      paranoid: true,
    });

    const transformed = Transformador.extraerDataValues(resultado) as any;
    
    const rows = transformed.rows.map((fila: any) => ({
      id: fila.id,
      cliente_id: fila.clienteId,
      nombre_cliente: fila.cliente?.nombreCompleto || '',
      correo_cliente: fila.cliente?.correo || '',
      identificacion_cliente: fila.cliente?.identificacion || null,
      fecha_cobro: fila.fechaCobro,
      valor_total: fila.valorTotal,
      fecha_pago: fila.fechaPago,
      valor_pagado: fila.valorPagado,
      tiene_pdf_pago: !!fila.urlPdfPago,
    }));

    return {
      rows,
      count: transformed.count,
    };
  }
}

