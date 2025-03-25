import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntity1742873340763 implements MigrationInterface {
  name = 'UserEntity1742873340763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "full_name" character varying NOT NULL, "birth_date" date NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "cpf" character varying NOT NULL, "isValidated" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
