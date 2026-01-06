export interface InvoiceGeneratedEvent {
  invoiceId: string;
  patientId?: string;
  totalAmount: number;
  items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
  createdAt: string;
}

export interface PaymentReceivedEvent {
  paymentId: string;
  invoiceId: string;
  amount: number;
  method: string;
  provider?: string;
  receivedAt: string;
}