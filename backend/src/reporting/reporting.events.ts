export interface ReportGeneratedEvent {
  reportId: string;
  templateId?: string;
  generatedAt: string;
  department?: string;
  type: string; // DAILY|WEEKLY|MONTHLY
}
