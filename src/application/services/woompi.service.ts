import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as moment from 'moment-timezone';
import { Config } from '../../infrastructure/config/config';
import { IGenerarLinkPagoRequest } from '../../domain/interfaces/pagos.interface';

@Injectable()
export class WoompiService {
  private readonly logger = new Logger(WoompiService.name);

  async generarLinkPago(datos: IGenerarLinkPagoRequest): Promise<string> {
    this.logger.log(
      `Generando link de pago Woompi para cuenta de cobro ID: ${datos.cuentaCobroId}`,
    );

    if (!Config.woompiPublicKey || !Config.woompiIntegritySecret) {
      const mensajeError =
        'Credenciales de Woompi no configuradas. Verifique WOOMPI_PUBLIC_KEY y WOOMPI_INTEGRITY_SECRET en el archivo .env';
      this.logger.error(mensajeError);
      throw new Error(mensajeError);
    }

    const amountInCents = Math.round(datos.valorTotal * 100);
    const expirationTime = moment
      .tz(datos.fechaLimitePago, 'America/Bogota')
      .format('YYYY-MM-DDTHH:mm:ssZ');

    const parametros: Record<string, string> = {
      'public-key': Config.woompiPublicKey,
      currency: 'COP',
      'amount-in-cents': amountInCents.toString(),
      reference: datos.referencia,
      'tax-in-cents:vat': '0',
    };

    if (Config.woompiRedirectUrl) {
      parametros['redirect-url'] = Config.woompiRedirectUrl;
    }

    if (datos.fechaLimitePago) {
      parametros['expiration-time'] = expirationTime;
    }

    if (datos.correoCliente) {
      parametros['customer-data:email'] = datos.correoCliente;
    }

    if (datos.nombreCliente) {
      parametros['customer-data:full-name'] = datos.nombreCliente;
    }

    if (datos.identificacionCliente) {
      parametros['customer-data:legal-id'] = datos.identificacionCliente;
      parametros['customer-data:legal-id-type'] = datos.tipoDocumentoCliente || 'CC';
    }

    if (datos.telefonoCliente) {
      parametros['customer-data:phone-number'] = datos.telefonoCliente;
    }

    const firmaIntegridad = this.generarFirmaIntegridad(
      parametros,
      Config.woompiIntegritySecret,
    );

    parametros['signature:integrity'] = firmaIntegridad;

    const queryString = new URLSearchParams(parametros).toString();
    const urlCheckout = `https://checkout.wompi.co/p/?${queryString}`;

    this.logger.log(
      `Link de pago Woompi generado exitosamente para cuenta de cobro ID: ${datos.cuentaCobroId}`,
    );
    this.logger.debug(`URL generada: ${urlCheckout}`);

    return urlCheckout;
  }

  private generarFirmaIntegridad(
    parametros: Record<string, string>,
    integritySecret: string,
  ): string {
    const parametrosOrdenados = Object.keys(parametros)
      .filter((key) => key !== 'signature:integrity')
      .sort()
      .map((key) => `${key}${parametros[key]}`)
      .join('');

    const hmac = crypto
      .createHmac('sha256', integritySecret)
      .update(parametrosOrdenados)
      .digest('hex');

    return hmac;
  }
}
