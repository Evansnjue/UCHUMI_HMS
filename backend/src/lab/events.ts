export interface LabCompletedEvent { labRequestId: string; at: string; }
export interface LabResultUpdatedEvent { labResultId: string; at: string; }
export type LabEvents = LabCompletedEvent | LabResultUpdatedEvent;
