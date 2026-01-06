/**
 * Events emitted by the Pharmacy module
 */
export interface DrugDispensedEvent {
  prescriptionId: string;
  prescriptionItemId: string;
  drugId: string;
  pharmacistId: string;
  quantity: number;
  dispensedAt: string; // ISO
}

export interface StockUpdatedEvent {
  drugId: string;
  location: string;
  oldQuantity: number;
  newQuantity: number;
  updatedAt: string;
}
