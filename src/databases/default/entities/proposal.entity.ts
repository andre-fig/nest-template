import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform, Type } from 'class-transformer';
import { NumericTransformer } from '../../../shared/utils/numeric-transformer.util';
import { TransformNumeric } from '../../../shared/utils/transform-numeric.util';

@Entity('proposals', { schema: 'deals' })
export class ProposalEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'crm_id' })
  crmId: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ name: 'sales_table_id' })
  salesTableId: string;

  @Column({ name: 'franchise_id' })
  franchiseId: string;

  @Column({ name: 'simulation_id' })
  simulationId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'squad_id' })
  squadId: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'resume' })
  resume: string;

  @Column({ name: 'credential_id' })
  credentialId: string;

  @Column({ name: 'partner_contract_id' })
  partnerContractId: string;

  @Column('character varying', {
    name: 'client_formalization_url',
    nullable: true,
  })
  clientFormalizationUrl: string | null;

  @Column('character varying', { name: 'description', nullable: true })
  description: string | null;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: NumericTransformer,
  })
  @Transform(TransformNumeric)
  value: number;

  @Column('numeric', {
    name: 'net_value',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: NumericTransformer,
  })
  @Transform(TransformNumeric)
  netValue: number;

  @Column({ name: 'term' })
  term: number;

  @Column('numeric', {
    name: 'installment_value',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: NumericTransformer,
  })
  @Transform(TransformNumeric)
  installmentValue: number;

  @Column('numeric', {
    name: 'debit_balance',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: NumericTransformer,
  })
  @Transform(TransformNumeric)
  debitBalance: number;

  @Column({ name: 'coefficient' })
  coefficient: number;

  @Column({ name: 'status' })
  status: string;

  @Column('character varying', { nullable: true, name: 'substatus' })
  subStatus: string | null;

  @Column('uuid', { name: 'partner_status_id', nullable: true })
  partnerStatusId: string | null;

  @Column({ name: 'origin' })
  origin: string;

  @Column({ name: 'typed_at' })
  @Type(() => Date)
  typedAt: Date;

  @Column({ name: 'finished_at' })
  @Type(() => Date)
  finishedAt: Date;

  @Column({ name: 'first_due_date' })
  @Type(() => Date)
  firstDueDate: Date;

  @Column({ name: 'pay_date' })
  @Type(() => Date)
  payDate: Date;

  @Column({ name: 'signed_contract' })
  signedContract: string;

  @Column({ name: 'last_update_attempt' })
  @Type(() => Date)
  lastUpdateAttempt: Date;

  @Column({ name: 'portability_number' })
  portabilityNumber: string;

  @Column({ name: 'partner' })
  partner: string;

  @Column({ name: 'expected_balance_date' })
  @Type(() => Date)
  expectedBalanceDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Type(() => Date)
  deletedAt: Date;
}
