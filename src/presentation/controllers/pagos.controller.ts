import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Request } from 'express';
import { WoompiService } from '../../application/services/woompi.service';
import { LogService } from '../../application/services/log.service';
import { PagoService } from '../../application/services/pago.service';
import { GenerarLinkPagoRequestDto } from '../dto/generar-link-pago.request.dto';
import { GenerarLinkPagoResponseDto } from '../dto/generar-link-pago.response.dto';
import { PaginadoPagosRequestDto } from '../dto/paginado-pagos.request.dto';
import { PagosPaginadasResponseDto } from '../dto/pagos-paginadas.response.dto';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';

interface RequestConTenant extends Request {
  tenantId: number;
}

@ApiTags('Pagos')
@Controller('api/v1/pagos')
export class PagosController {
  private readonly logger = new Logger(PagosController.name);

  constructor(
    private readonly woompiService: WoompiService,
    private readonly logService: LogService,
    private readonly pagoService: PagoService,
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Recibir datos de pasarela de pago',
    description:
      'Endpoint para recibir datos de la pasarela de pago. Acepta cualquier dato y lo almacena en logs para su procesamiento posterior.',
  })
  @ApiCreatedResponse({
    description: 'Datos recibidos y guardados exitosamente',
  })
  async recibirDatosPasarela(
    @Body() datos: Record<string, any>,
  ): Promise<void> {
    try {
      this.logger.verbose(
        `✅ PAGOS: Se recibió petición POST /api/v1/pagos desde pasarela`,
      );
      await this.logService.crear(datos, 'pagos');
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOperation({
    summary: 'Listar pagos',
    description:
      'Obtiene una lista paginada de pagos (cuentas de cobro con estado pagada)',
  })
  @ApiOkResponse({
    description: 'Lista de pagos obtenida exitosamente',
    type: PagosPaginadasResponseDto,
  })
  async listarPagos(
    @Query() query: PaginadoPagosRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<PagosPaginadasResponseDto> {
    try {
      const tenantId = request.tenantId;
      const pagina = query.pagina ?? 1;
      const tamanoPagina = query.tamanoPagina ?? 10;
      const clientePaqueteId = query.clientePaqueteId;

      const resultado = await this.pagoService.listarPagos(
        tenantId,
        pagina,
        tamanoPagina,
        clientePaqueteId,
      );

      return plainToInstance(PagosPaginadasResponseDto, resultado, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
