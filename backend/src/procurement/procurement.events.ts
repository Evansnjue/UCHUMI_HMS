export interface PurchaseOrderCreatedEvent {
  purchaseOrderId: string;
  supplierId: string;
  totalAmount: number;
}

export interface InsuranceClaimProcessedEvent {
  claimId: string;
  claimNumber: string;
  status: string;
}
