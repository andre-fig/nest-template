import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailStrategy } from './strategies/email.strategy';
import { DispatchStrategyInterface } from './interfaces/dispatch-strategy.interface';
import { DispatchMessageDto } from './dtos/dispatch-message.dto';
import { SmsStrategy } from './strategies/sms.strategy';
import { WhatsAppStrategy } from './strategies/whatsapp.strategy';
import { QueueEnum } from 'src/shared/enums/queue.enum';
import { ChannelEnum } from 'src/shared/enums/channel.enum';

@Processor(QueueEnum.DISPATCHER)
export class DispatcherProcessor extends WorkerHost {
  private readonly strategies: Record<string, DispatchStrategyInterface>;

  constructor(
    private readonly emailStrategy: EmailStrategy,
    private readonly smsStrategy: SmsStrategy,
    private readonly whatsAppStrategy: WhatsAppStrategy,
  ) {
    super();
    this.strategies = {
      email: this.emailStrategy,
      sms: this.smsStrategy,
      whatsApp: this.whatsAppStrategy,
    };
  }

  async process(job: Job<DispatchMessageDto>): Promise<void> {
    const { channel, recipient, payload, metadata } = job.data;

    const strategy = this.strategies[ChannelEnum[channel] as ChannelEnum];

    if (!strategy) {
      throw new Error(`Unsupported channel: ${channel}`);
    }

    await strategy.send(recipient, payload, metadata);
  }
}
