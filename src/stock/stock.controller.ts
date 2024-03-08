import { Query, Controller, Get } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockDto } from './dtos/stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/')
  async getCurrentStockLevel(@Query('sku') sku: string): Promise<StockDto> {
    return this.stockService.getCurrentStockLevel(sku);
  }
}
