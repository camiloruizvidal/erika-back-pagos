import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { PagosController } from './presentation/controllers/pagos.controller';
import { WoompiService } from './application/services/woompi.service';
import { LogService } from './application/services/log.service';
import { PagoService } from './application/services/pago.service';
import { ManejadorError } from './utils/manejador-error/manejador-error';
import { JwtTenantGuard } from './presentation/guards/jwt-tenant.guard';
import { Config } from './infrastructure/config/config';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    JwtModule.register({
      secret: Config.jwtKey,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AppController, PagosController],
  providers: [
    AppService,
    WoompiService,
    LogService,
    PagoService,
    ManejadorError,
    JwtTenantGuard,
  ],
})
export class AppModule {}
