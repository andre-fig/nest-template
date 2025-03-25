export interface DispatchStrategyInterface {
  send(
    recipient: string,
    payload: Record<string, any>,
    metadata?: Record<string, any>,
  ): void;
}
