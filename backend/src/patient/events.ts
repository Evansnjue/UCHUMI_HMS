export interface PatientRegisteredEvent {
  patientId: string;
  at: string;
}

export interface PatientUpdatedEvent {
  patientId: string;
  at: string;
}

export type PatientEvents = PatientRegisteredEvent | PatientUpdatedEvent;
