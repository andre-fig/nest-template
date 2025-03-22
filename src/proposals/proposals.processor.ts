import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueEnum } from '../shared/enums/queue.enum';
import { ProposalEntity } from '../databases/default/entities/proposal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseEnum } from '../shared/enums/database.enum';
import { Repository } from 'typeorm';
import { isValidEntity } from '../shared/utils/is-valid-entity.util';
import _ from 'lodash';
import { plainToInstance } from 'class-transformer';

@Processor(QueueEnum.PROPOSALS, { concurrency: 1 })
export class ProposalProcessor extends WorkerHost {
  constructor(
    @InjectRepository(ProposalEntity, DatabaseEnum.DEFAULT)
    private readonly proposalRepository: Repository<ProposalEntity>,
  ) {
    super();
  }

  async process(job: Job<Partial<ProposalEntity>>) {
    const partialProposalEntity = plainToInstance(ProposalEntity, job.data);

    try {
      await this.update(partialProposalEntity);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async update(
    partialProposal: Partial<ProposalEntity>,
  ): Promise<ProposalEntity> {
    try {
      if (
        !partialProposal?.id ||
        !isValidEntity(partialProposal, ProposalEntity)
      ) {
        throw new BadRequestException('Dados inválidos para atualização.');
      }

      const proposal = await this.proposalRepository.findOne({
        where: { id: partialProposal.id },
      });

      if (!proposal) {
        throw new NotFoundException(
          `Proposta não encontrada: ${partialProposal.id}`,
        );
      }

      Object.assign(proposal, partialProposal);

      const savedProposal = await this.proposalRepository.save(proposal);

      if (!savedProposal) {
        throw new InternalServerErrorException(
          `Erro ao salvar proposta: ${partialProposal.id}`,
        );
      }

      await new Promise((r) => setTimeout(r, 50));

      const updatedProposal = await this.proposalRepository.findOne({
        where: { id: partialProposal.id },
      });

      if (!updatedProposal) {
        throw new InternalServerErrorException(
          `Erro ao recuperar proposta após atualização: ${partialProposal.id}`,
        );
      }

      const differences = this.findDifferences(
        partialProposal,
        updatedProposal,
      );

      if (differences.length > 0) {
        throw new InternalServerErrorException(
          `Os dados não foram atualizados corretamente para a proposta: ${partialProposal.id}. Diferenças encontradas: ${JSON.stringify(
            differences,
          )}`,
        );
      }

      return updatedProposal;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private findDifferences(
    inputData: Partial<ProposalEntity>,
    outputData: ProposalEntity,
  ) {
    return Object.keys(inputData).reduce(
      (acc, key) => {
        const inputValue = inputData[key as keyof ProposalEntity];
        const outputValue = outputData[key as keyof ProposalEntity];

        if (!_.isEqual(inputValue, outputValue)) {
          acc.push({
            field: key,
            expected: inputValue,
            found: outputValue,
          });
        }

        return acc;
      },
      [] as { field: string; expected: any; found: any }[],
    );
  }
}
