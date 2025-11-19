import { Injectable, Logger } from '@nestjs/common';
import { PagoRepository } from '../../infrastructure/persistence/repositories/pago.repository';
import { IPaginado } from '../../shared/interfaces/paginado.interface';
import { IPagoListado } from '../../infrastructure/persistence/repositories/pago.repository';

@Injectable()
export class PagoService {
  private readonly logger = new Logger(PagoService.name);

  async listarPagos(
    tenantId: number,
    pagina: number,
    tamanoPagina: number,
    clientePaqueteId: number,
  ): Promise<IPaginado<IPagoListado>> {
    const offset = (pagina - 1) * tamanoPagina;

    const resultado = await PagoRepository.listarPagosPaginados(
      tenantId,
      offset,
      tamanoPagina,
      clientePaqueteId,
    );

    const total = resultado.count;
    const totalPaginas = tamanoPagina > 0 ? Math.ceil(total / tamanoPagina) : 0;

    return {
      meta: {
        total,
        pagina,
        tamanoPagina: tamanoPagina,
        totalPaginas: totalPaginas,
      },
      data: resultado.rows,
    };
  }
}

