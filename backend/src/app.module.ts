import { Module } from '@nestjs/common';
import { CacheModule } from './common/cache/cache.module';
import { ProductsModule } from './products/products.module';

/**
 * Module racine de l'application.
 */
@Module({
  imports: [CacheModule, ProductsModule],
})
export class AppModule {}
