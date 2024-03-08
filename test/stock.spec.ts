import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from '../src/stock/stock.service';
import { promises as fs } from 'fs';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe('StockService', () => {
  let service: StockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockService],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the current stock level for an existing SKU', async () => {
    jest.spyOn(fs, 'readFile').mockImplementation((path: string) => {
      if (path.includes('stock.json')) {
        return Promise.resolve(JSON.stringify([{ sku: 'SKU123', stock: 10 }]));
      }
      if (path.includes('transactions.json')) {
        return Promise.resolve(
          JSON.stringify([{ sku: 'SKU123', type: 'order', qty: 5 }]),
        );
      }
      return Promise.resolve('[]');
    });

    await expect(service.getCurrentStockLevel('SKU123')).resolves.toEqual({
      sku: 'SKU123',
      qty: 5,
    });
  });

  it('should throw NotFoundException for a non-existing SKU', async () => {
    jest.spyOn(fs, 'readFile').mockImplementation(() => Promise.resolve('[]'));

    await expect(
      service.getCurrentStockLevel('NONEXISTENTSKU'),
    ).rejects.toThrowError();
  });
});
