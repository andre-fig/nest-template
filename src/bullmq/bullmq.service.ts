import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { JobsOptions, Queue } from 'bullmq';
import { QueueEnum } from 'src/shared/enums/queue.enum';

@Injectable()
export class BullmqService {
  private readonly logger = new Logger(BullmqService.name);
  private readonly queueMap: Record<QueueEnum, Queue>;

  constructor(
    @InjectQueue(QueueEnum.DISPATCHER)
    private readonly dispatcherQueue: Queue,
  ) {
    this.queueMap = {
      [QueueEnum.DISPATCHER]: this.dispatcherQueue,
    };
  }

  public getQueue(queueValue: string): Queue {
    const queue = this.queueMap[queueValue as QueueEnum];

    if (!queue) {
      throw new Error(`Queue "${queueValue}" not registered in BullService`);
    }

    return queue;
  }

  public async addJob<T = unknown>(
    queue: string,
    jobName: string,
    payload: T,
    jobOptions: Partial<JobsOptions> = {},
  ): Promise<void> {
    const queueInstance = this.getQueue(queue);

    try {
      await queueInstance.add(jobName, payload, jobOptions);
    } catch (error) {
      this.logger.error(
        `[ERROR] Failed to add job "${jobName}" to queue "${queue}"`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
