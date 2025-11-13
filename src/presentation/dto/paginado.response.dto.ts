import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class MetaPaginadoResponseDto {
  @ApiProperty({ description: 'Total de registros disponibles', type: Number })
  @Expose({ name: 'total' })
  total!: number;

  @ApiProperty({
    description: 'Número de página solicitada (base 1)',
    type: Number,
  })
  @Expose({ name: 'pagina' })
  pagina!: number;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    type: Number,
  })
  @Expose({ name: 'tamanoPagina' })
  tamano_pagina!: number;

  @ApiProperty({
    description: 'Cantidad total de páginas disponibles',
    type: Number,
  })
  @Expose({ name: 'totalPaginas' })
  total_paginas!: number;
}

export class PaginadoResponseDto<T> {
  @ApiProperty({ type: () => MetaPaginadoResponseDto })
  @Expose({ name: 'meta' })
  @Type(() => MetaPaginadoResponseDto)
  meta!: MetaPaginadoResponseDto;

  @ApiProperty({ isArray: true, type: () => Object })
  @Expose({ name: 'data' })
  data!: T[];
}
