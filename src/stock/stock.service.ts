import { Injectable, NotFoundException } from '@nestjs/common';
import { StockDto } from './dtos/stock.dto';
import { promises as fs } from 'fs';

@Injectable()
export class StockService {
  private async readJsonFromFile(path: string): Promise<any> {
    try {
      const data = await fs.readFile(path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCurrentStockLevel(sku: string): Promise<StockDto> {
    try {
      const stockPath = './stock.json';
      const transactionsPath = './transactions.json';
      const stock = await this.readJsonFromFile(stockPath);
      const transactions = await this.readJsonFromFile(transactionsPath);

      let currentStock =
        stock.find((item: StockDto) => item.sku === sku)?.stock || 0;

      transactions.forEach(
        (transaction: { sku: string; type: string; qty: number }) => {
          if (transaction.sku === sku) {
            currentStock +=
              transaction.type === 'order' ? -transaction.qty : transaction.qty;
          }
        },
      );

      if (
        currentStock === 0 &&
        !stock.some((item: StockDto) => item.sku === sku) &&
        !transactions.some((t) => t.sku === sku)
      ) {
        throw new NotFoundException(
          `SKU ${sku} does not exist in stock and transactions records.`,
        );
      }

      return { sku, qty: currentStock };
    } catch (error) {
      throw error;
    }
  }
}
