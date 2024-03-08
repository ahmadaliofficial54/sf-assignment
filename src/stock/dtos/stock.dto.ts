import { IsString, IsNumber, IsOptional } from 'class-validator';
export class StockDto {
  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsNumber()
  qty?: number;
}
