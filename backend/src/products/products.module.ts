import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from './domain/product-repository.interface';
import { InMemoryProductRepository } from './infrastructure/in-memory-product.repository';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

/**
 * Feature module « produits ».
 *
 * Le repository concret est lié au token abstrait PRODUCT_REPOSITORY :
 * pour brancher une vraie base de données plus tard, il suffit de changer
 * cette ligne `useClass` — le service reste inchangé (Open/Closed).
 */
@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: InMemoryProductRepository,
    },
  ],
})
export class ProductsModule {}
