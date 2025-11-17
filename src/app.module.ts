import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PagosController } from './presentation/controllers/pagos.controller';
import { WoompiService } from './application/services/woompi.service';
import { ManejadorError } from './utils/manejador-error/manejador-error';

@Module({
  imports: [HttpModule],
  controllers: [AppController, PagosController],
  providers: [AppService, WoompiService, ManejadorError],
})
export class AppModule {}
