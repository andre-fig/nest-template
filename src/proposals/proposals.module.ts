import { Module } from '@nestjs/common';
import { ProposalProcessor } from './proposals.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalEntity } from '../databases/default/entities/proposal.entity';
import { DatabaseEnum } from '../shared/enums/database.enum';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalEntity], DatabaseEnum.DEFAULT)],
  providers: [ProposalProcessor],
  exports: [],
})
export class ProposalsModule {}
