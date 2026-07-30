import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

/**
 * Module global exposant le CacheService à toute l'application.
 * Global pour éviter de le ré-importer dans chaque feature module.
 */
@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
