import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { WoompiService } from '../../application/services/woompi.service';
import { GenerarLinkPagoRequestDto } from '../dto/generar-link-pago.request.dto';
import { GenerarLinkPagoResponseDto } from '../dto/generar-link-pago.response.dto';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';

@ApiTags('Pagos')
@Controller('api/v1/pagos')
export class PagosController {
  private readonly logger = new Logger(PagosController.name);

  constructor(
    private readonly woompiService: WoompiService,
    private readonly manejadorError: ManejadorError,
  ) {}

  @Post('generar-link-pago')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generar link de pago',
    description:
      'Genera un link de pago mediante Woompi (Bancolombia) para una cuenta de cobro',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Link de pago generado exitosamente',
    type: GenerarLinkPagoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  async generarLinkPago(
    @Body() datos: GenerarLinkPagoRequestDto,
  ): Promise<GenerarLinkPagoResponseDto> {
    try {
      const linkPago = await this.woompiService.generarLinkPago(datos);
      return plainToInstance(GenerarLinkPagoResponseDto, { linkPago });
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
