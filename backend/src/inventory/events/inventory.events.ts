export interface StockUpdatedEvent {
  itemId: string;
  departmentId?: string;
  oldQuantity: number;
  newQuantity: number;
  updatedAt: string;
}

export interface StockLowAlertEvent {
  itemId: string;
  departmentId?: string;
  quantity: number;
  threshold: number;
  detectedAt: string;
}
