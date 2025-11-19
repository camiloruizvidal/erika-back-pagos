import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PagoListadoResponseDto {
  @ApiProperty({
    description: 'Identificador del pago (cuenta de cobro)',
    type: Number,
  })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Identificador del cliente', type: Number })
  @Expose()
  cliente_id!: number;

  @ApiProperty({ description: 'Nombre completo del cliente', type: String })
  @Expose()
  nombre_cliente!: string;

  @ApiProperty({ description: 'Correo electrónico del cliente', type: String })
  @Expose()
  correo_cliente!: string;

  @ApiProperty({
    description: 'Documento de identificación del cliente',
    type: String,
    nullable: true,
  })
  @Expose()
  identificacion_cliente!: string | null;

  @ApiProperty({ description: 'Fecha de cobro', type: Date })
  @Expose()
  fecha_cobro!: Date;

  @ApiProperty({
    description: 'Valor total de la cuenta de cobro',
    type: Number,
  })
  @Expose()
  valor_total!: number;

  @ApiProperty({
    description: 'Fecha de pago',
    type: Date,
    nullable: true,
  })
  @Expose()
  fecha_pago!: Date | null;

  @ApiProperty({
    description: 'Valor pagado',
    type: Number,
    nullable: true,
  })
  @Expose()
  valor_pagado!: number | null;

  @ApiProperty({
    description: 'Indica si se generó el PDF del recibo de pago',
    type: Boolean,
  })
  @Expose()
  tiene_pdf_pago!: boolean;
}

