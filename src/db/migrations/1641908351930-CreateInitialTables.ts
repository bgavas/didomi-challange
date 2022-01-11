import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1641908351930 implements MigrationInterface {
  name = 'CreateInitialTables1641908351930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "user_consent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "enabled" boolean NOT NULL, "userId" uuid NOT NULL, "consentId" character varying NOT NULL, CONSTRAINT "PK_b22925348311c2e41cc80b05171" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE INDEX "IDX_3ca13251d989aa9f2cf5eff212" ON "user_consent" ("userId") ');
    await queryRunner.query('CREATE INDEX "IDX_63bcfd67b67340594e97cd2628" ON "user_consent" ("consentId") ');
    await queryRunner.query('CREATE TABLE "consent" ("id" character varying NOT NULL, CONSTRAINT "PK_9115e8d6b082d4fc46d56134d29" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "user_consent_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "enabled" boolean NOT NULL, "userId" uuid NOT NULL, "consentId" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e81dedfd50b022043676bd68290" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE INDEX "IDX_490e2f8a01a117c544f73c4855" ON "user_consent_log" ("userId") ');
    await queryRunner.query('CREATE INDEX "IDX_8488bfaaf95b11cd45355ad1a8" ON "user_consent_log" ("consentId") ');
    await queryRunner.query('ALTER TABLE "user_consent" ADD CONSTRAINT "FK_3ca13251d989aa9f2cf5eff2126" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "user_consent" ADD CONSTRAINT "FK_63bcfd67b67340594e97cd26289" FOREIGN KEY ("consentId") REFERENCES "consent"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "user_consent_log" ADD CONSTRAINT "FK_490e2f8a01a117c544f73c48553" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "user_consent_log" ADD CONSTRAINT "FK_8488bfaaf95b11cd45355ad1a88" FOREIGN KEY ("consentId") REFERENCES "consent"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.manager
      .query('INSERT INTO "consent" ("id") VALUES (\'email_notifications\')');
    await queryRunner.manager
      .query('INSERT INTO "consent" ("id") VALUES (\'sms_notifications\')');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user_consent_log" DROP CONSTRAINT "FK_8488bfaaf95b11cd45355ad1a88"');
    await queryRunner.query('ALTER TABLE "user_consent_log" DROP CONSTRAINT "FK_490e2f8a01a117c544f73c48553"');
    await queryRunner.query('ALTER TABLE "user_consent" DROP CONSTRAINT "FK_63bcfd67b67340594e97cd26289"');
    await queryRunner.query('ALTER TABLE "user_consent" DROP CONSTRAINT "FK_3ca13251d989aa9f2cf5eff2126"');
    await queryRunner.query('DROP INDEX "public"."IDX_8488bfaaf95b11cd45355ad1a8"');
    await queryRunner.query('DROP INDEX "public"."IDX_490e2f8a01a117c544f73c4855"');
    await queryRunner.query('DROP TABLE "user_consent_log"');
    await queryRunner.query('DROP TABLE "consent"');
    await queryRunner.query('DROP INDEX "public"."IDX_63bcfd67b67340594e97cd2628"');
    await queryRunner.query('DROP INDEX "public"."IDX_3ca13251d989aa9f2cf5eff212"');
    await queryRunner.query('DROP TABLE "user_consent"');
    await queryRunner.query('DROP TABLE "user"');
  }
}
