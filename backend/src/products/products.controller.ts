import { Controller, Get, Query } from '@nestjs/common';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
import { Product } from './domain/product.entity';
import { QueryProductsDto } from './dto/query-products.dto';
import { ProductsService } from './products.service';

/**
 * Unique point d'entrée HTTP du catalogue : GET /products.
 * Aucune création / mise à jour / suppression (conforme à l'énoncé).
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /products
   * Query params : page, limit, category, stock_status.
   * La validation/normalisation est assurée par QueryProductsDto + ValidationPipe.
   */
  @Get()
  findAll(@Query() query: QueryProductsDto): PaginatedResponse<Product> {
    return this.productsService.findAll(query);
  }
}
