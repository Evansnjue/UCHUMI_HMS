export interface VisitCreatedEvent { visitId: string; at: string; }
export interface VisitCompletedEvent { visitId: string; at: string; }
export type VisitEvents = VisitCreatedEvent | VisitCompletedEvent;
