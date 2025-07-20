import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAliasToPhoto1750727572051 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "photo" ADD COLUMN "alias" TEXT;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "photo" DROP COLUMN "alias";
        `)
  }
}
