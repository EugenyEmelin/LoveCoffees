import {MigrationInterface, QueryRunner} from "typeorm";

export class SchemaSync1625871122755 implements MigrationInterface {
    name = 'SchemaSync1625871122755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "test" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "test"`);
    }

}
