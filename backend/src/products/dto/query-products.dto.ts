import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { StockStatus } from '../domain/product.entity';

/**
 * Paramètres de requête de GET /products.
 * Valide et normalise page/limit/category/stock_status.
 *
 * Les query params arrivent en string : @Transform les convertit en number
 * avant l'exécution des contraintes @IsInt/@Min.
 */
export class QueryProductsDto {
  @IsOptional()
  @Transform(({ value }) => toInt(value))
  @IsInt({ message: 'page doit être un entier' })
  @Min(1, { message: 'page doit être >= 1' })
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => toInt(value))
  @IsInt({ message: 'limit doit être un entier' })
  @Min(1, { message: 'limit doit être >= 1' })
  @Max(100, { message: 'limit doit être <= 100' })
  limit: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => normalizeString(value))
  category?: string;

  @IsOptional()
  @Transform(({ value }) => normalizeString(value))
  @IsEnum(StockStatus, {
    message: `stock_status doit être l'un de : ${Object.values(StockStatus).join(', ')}`,
  })
  stock_status?: StockStatus;
}

function toInt(value: unknown): unknown {
  if (value === undefined || value === null || value === '') {
    return value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
}

function normalizeString(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}
