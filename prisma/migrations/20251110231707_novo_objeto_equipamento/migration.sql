-- CreateTable
CREATE TABLE `equipamento` (
    `id_equipamento` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `tipo` ENUM('CHECK_STANDS_MOBILIAS', 'CHECK_OUTS', 'GONDOLAS', 'RACK_INTEGRADO', 'REFRIGERACAO_MAQUINA_ACOPLADA', 'ELETROFRIO') NOT NULL,
    `num_serie` VARCHAR(100) NOT NULL,
    `numero_os` INTEGER NOT NULL,

    INDEX `fk_equipamento_os`(`numero_os`),
    PRIMARY KEY (`id_equipamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipamento` ADD CONSTRAINT `fk_equipamento_os` FOREIGN KEY (`numero_os`) REFERENCES `ordem_servico`(`numero_os`) ON DELETE CASCADE ON UPDATE CASCADE;
