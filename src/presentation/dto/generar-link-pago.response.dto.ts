import { ApiProperty } from '@nestjs/swagger';

export class GenerarLinkPagoResponseDto {
  @ApiProperty({
    description: 'Link de pago generado',
    example: 'https://checkout.woompi.com/payment/abc123xyz',
  })
  linkPago!: string;
}

