import { Module } from '@nestjs/common';
import { DispatcherProcessor } from './dispatcher.processor';
import { EmailStrategy } from './strategies/email.strategy';
import { SmsStrategy } from './strategies/sms.strategy';
import { WhatsAppStrategy } from './strategies/whatsapp.strategy';

@Module({
  imports: [],
  controllers: [],
  providers: [
    DispatcherProcessor,
    EmailStrategy,
    SmsStrategy,
    WhatsAppStrategy,
  ],
  exports: [],
})
export class DispatcherModule {}
