export interface PrescriptionIssuedEvent { prescriptionId: string; at: string; }
export interface LabRequestedEvent { labRequestId: string; at: string; }
export type ClinicalEvents = PrescriptionIssuedEvent | LabRequestedEvent;
