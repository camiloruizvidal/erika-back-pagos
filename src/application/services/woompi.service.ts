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

    this.logger.debug(`amountInCents: ${amountInCents}`);
    this.logger.debug(`expirationTime: ${expirationTime}`);

    const parametros: Record<string, string> = {
      'public-key': Config.woompiPublicKey,
      currency: 'COP',
      'amount-in-cents': amountInCents.toString(),
      reference: datos.referencia,
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
      parametros['customer-data:legal-id-type'] =
        datos.tipoDocumentoCliente || 'CC';
    }

    if (datos.telefonoCliente) {
      parametros['customer-data:phone-number'] = datos.telefonoCliente;
    }

    const firmaIntegridad = this.generarFirmaIntegridad(
      parametros,
      Config.woompiIntegritySecret,
    );

    parametros['signature:integrity'] = firmaIntegridad;

    const parametrosParaUrl = new URLSearchParams();
    for (const key of Object.keys(parametros)) {
      parametrosParaUrl.append(key, parametros[key]);
    }

    const queryString = parametrosParaUrl.toString();
    const urlCheckout = `${Config.woompiCheckoutUrl}?${queryString}`;

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
    const parametrosSinFirma: Record<string, string> = {};

    for (const key of Object.keys(parametros)) {
      if (key !== 'signature:integrity') {
        parametrosSinFirma[key] = parametros[key];
      }
    }

    const tempUrlParams = new URLSearchParams();
    for (const key of Object.keys(parametrosSinFirma)) {
      tempUrlParams.append(key, parametrosSinFirma[key]);
    }

    const queryString = tempUrlParams.toString();
    const paresCodificados = queryString.split('&').map((par) => {
      const [key, value = ''] = par.split('=');
      return [key, value];
    });

    paresCodificados.sort((a, b) => {
      const keyA = decodeURIComponent(a[0]);
      const keyB = decodeURIComponent(b[0]);
      return keyA.localeCompare(keyB);
    });

    this.logger.debug('=== DEBUG FIRMA INTEGRIDAD ===');
    this.logger.debug('Parámetros ordenados alfabéticamente (codificados):');
    paresCodificados.forEach(([key, value]) => {
      this.logger.debug(`  ${key}: ${value}`);
    });

    const stringParaFirma = paresCodificados
      .map(([key, value]) => `${key}${value}`)
      .join('');

    this.logger.debug(
      `String completo para firma (codificado): ${stringParaFirma}`,
    );
    this.logger.debug(
      `Integrity Secret (primeros 10 chars): ${integritySecret.substring(0, 10)}...`,
    );

    const hmac = crypto
      .createHmac('sha256', integritySecret)
      .update(stringParaFirma)
      .digest('hex');

    this.logger.debug(`Firma generada: ${hmac}`);
    this.logger.debug('=== FIN DEBUG FIRMA INTEGRIDAD ===');

    return hmac;
  }
}
