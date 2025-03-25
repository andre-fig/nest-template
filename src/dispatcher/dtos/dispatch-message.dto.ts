export class DispatchMessageDto {
  channel: string;
  recipient: string;
  payload: Record<string, any>;
  metadata?: Record<string, any>;
}
