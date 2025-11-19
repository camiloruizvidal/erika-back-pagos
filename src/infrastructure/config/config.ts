import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export class Config {
  static readonly puerto = Number(process.env.PORT);
  static readonly jwtKey = process.env.JWT_KEY;
  static readonly woompiBaseUrl = process.env.WOOMPI_BASE_URL;
  static readonly woompiPrivateKey = process.env.WOOMPI_PRIVATE_KEY;
  static readonly woompiPublicKey = process.env.WOOMPI_PUBLIC_KEY;
  static readonly woompiEventsSecret = process.env.WOOMPI_EVENTS_SECRET;
  static readonly woompiIntegritySecret = process.env.WOOMPI_INTEGRITY_SECRET;
  static readonly woompiRedirectUrl = process.env.WOOMPI_REDIRECT_URL;
  static readonly woompiCheckoutUrl = process.env.WOOMPI_CHECKOUT_URL;
  static readonly pagoBaseUrl = process.env.PAGO_BASE_URL;
  static readonly dbHost = process.env.DB_HOST;
  static readonly dbPuerto = Number(process.env.DB_PORT);
  static readonly dbUsuario = process.env.DB_USER;
  static readonly dbContrasena = process.env.DB_PASSWORD;
  static readonly dbBaseDatos = process.env.DB_NAME;
  static readonly dbDialect = process.env.DB_DIALECT as Dialect;
  static readonly dbLogging = process.env.DB_LOGGING === 'true';
}

const errors: string[] = [];
Object.keys(Config).forEach((key) => {
  if (
    Config[key] === null ||
    Config[key] === undefined ||
    `${Config[key]}`.trim() === ''
  ) {
    errors.push(`La variable de entorno ${key} es requerida`);
  }
});
if (errors.length > 0) {
  throw new Error(errors.join('\n'));
}
