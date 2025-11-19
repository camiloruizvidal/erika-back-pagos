import { Injectable, Logger } from '@nestjs/common';
import { LogRepository } from '../../infrastructure/persistence/repositories/log.repository';

@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name);

  async crear(datos: Record<string, any>, tipo: string): Promise<void> {
    try {
      await LogRepository.crear({
        datos,
        tipo,
      });
      this.logger.log(`Log creado exitosamente. Tipo: ${tipo}`);
    } catch (error) {
      this.logger.error({
        error: JSON.stringify(error),
        mensaje: 'Error al crear log',
      });
      throw error;
    }
  }
}

