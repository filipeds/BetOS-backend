-- AlterTable
ALTER TABLE `ordem_servico` ADD COLUMN `cep` VARCHAR(9) NULL,
    ADD COLUMN `complemento` VARCHAR(255) NULL,
    ADD COLUMN `numero` VARCHAR(10) NULL,
    ADD COLUMN `rua` VARCHAR(255) NULL;
