import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerarLinkPagoRequestDto {
  @ApiProperty({
    description: 'ID de la cuenta de cobro',
    example: 123,
  })
  @IsInt({ message: 'El ID de cuenta de cobro debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de cuenta de cobro es requerido' })
  cuentaCobroId!: number;

  @ApiProperty({
    description: 'Valor total a pagar',
    example: 150000.00,
  })
  @IsNumber({}, { message: 'El valor total debe ser un número' })
  @Min(0.01, { message: 'El valor total debe ser mayor a 0' })
  @IsNotEmpty({ message: 'El valor total es requerido' })
  @Type(() => Number)
  valorTotal!: number;

  @ApiProperty({
    description: 'Referencia del pago',
    example: 'CC-123',
  })
  @IsString({ message: 'La referencia debe ser un texto' })
  @IsNotEmpty({ message: 'La referencia es requerida' })
  referencia!: string;

  @ApiProperty({
    description: 'Descripción del pago',
    example: 'Cuenta de cobro #123',
  })
  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  descripcion!: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'cliente@example.com',
  })
  @IsEmail({}, { message: 'El correo del cliente debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo del cliente es requerido' })
  correoCliente!: string;

  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Juan Pérez',
  })
  @IsString({ message: 'El nombre del cliente debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
  nombreCliente!: string;

  @ApiProperty({
    description: 'Fecha límite para realizar el pago',
    example: '2025-11-22T00:00:00.000Z',
  })
  @IsNotEmpty({ message: 'La fecha límite de pago es requerida' })
  @Type(() => Date)
  fechaLimitePago!: Date;
}

