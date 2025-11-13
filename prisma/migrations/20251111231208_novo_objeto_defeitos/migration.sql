-- CreateTable
CREATE TABLE `defeito` (
    `id_defeito` INTEGER NOT NULL AUTO_INCREMENT,
    `peca` TEXT NOT NULL,
    `defeito` TEXT NOT NULL,
    `data_registro` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_equipamento` INTEGER NOT NULL,

    INDEX `fk_defeito_equipamento`(`id_equipamento`),
    PRIMARY KEY (`id_defeito`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `defeito` ADD CONSTRAINT `fk_defeito_equipamento` FOREIGN KEY (`id_equipamento`) REFERENCES `equipamento`(`id_equipamento`) ON DELETE CASCADE ON UPDATE CASCADE;
