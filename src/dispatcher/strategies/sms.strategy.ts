import { Injectable } from '@nestjs/common';
import { DispatchStrategyInterface } from '../interfaces/dispatch-strategy.interface';

@Injectable()
export class SmsStrategy implements DispatchStrategyInterface {
  send(
    recipient: string,
    payload: Record<string, any>,
    // metadata?: Record<string, any>,
  ): void {
    const subject = payload.subject as string;
    const body = payload.body as string;

    console.log(`[SMS] Para: ${recipient}`);
    console.log(`Assunto: ${subject}`);
    console.log(`Mensagem: ${body}`);
  }
}
