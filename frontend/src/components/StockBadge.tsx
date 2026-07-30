import { STOCK_STATUS_LABELS, type StockStatus } from '../types/product';

interface StockBadgeProps {
  status: StockStatus;
}

/** Pastille colorée indiquant le statut de stock. */
export function StockBadge({ status }: StockBadgeProps) {
  return (
    <span className={`badge badge--${status}`}>
      <span className="badge__dot" aria-hidden="true" />
      {STOCK_STATUS_LABELS[status]}
    </span>
  );
}
