-- CreateTable
CREATE TABLE `assinatura` (
    `id_assinatura` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_os` INTEGER NOT NULL,
    `tipo_assinatura` ENUM('TECNICO', 'CLIENTE') NOT NULL,
    `caminho_assinatura` VARCHAR(255) NOT NULL,
    `data_assinatura` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_assinatura_os`(`numero_os`),
    PRIMARY KEY (`id_assinatura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cliente` (
    `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cnpj` VARCHAR(18) NOT NULL,
    `cep` VARCHAR(9) NOT NULL,
    `numero` VARCHAR(10) NOT NULL,
    `telefone` VARCHAR(20) NOT NULL,
    `data_cadastro` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ativo` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `cnpj`(`cnpj`),
    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gestor` (
    `id_gestor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cnpj` VARCHAR(18) NOT NULL,
    `login` VARCHAR(50) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `data_cadastro` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ativo` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `cnpj`(`cnpj`),
    UNIQUE INDEX `login`(`login`),
    PRIMARY KEY (`id_gestor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordem_servico` (
    `numero_os` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cliente` INTEGER NOT NULL,
    `id_tecnico` INTEGER NULL,
    `custos` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `data_abertura` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `data_fechamento` TIMESTAMP(0) NULL,
    `finalizada` ENUM('Y', 'N') NULL DEFAULT 'N',
    `defeitos` TEXT NULL,
    `observacoes` TEXT NULL,

    INDEX `fk_os_cliente`(`id_cliente`),
    INDEX `fk_os_tecnico`(`id_tecnico`),
    INDEX `idx_os_data_abertura`(`data_abertura`),
    INDEX `idx_os_finalizada`(`finalizada`),
    PRIMARY KEY (`numero_os`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `os_foto` (
    `id_foto` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_os` INTEGER NOT NULL,
    `caminho_foto` VARCHAR(255) NOT NULL,
    `data_upload` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `descricao` VARCHAR(255) NULL,

    INDEX `fk_foto_os`(`numero_os`),
    PRIMARY KEY (`id_foto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tecnico` (
    `id_tecnico` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cnpj` VARCHAR(18) NOT NULL,
    `login` VARCHAR(50) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `id_gestor` INTEGER NOT NULL,
    `data_cadastro` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ativo` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `cnpj`(`cnpj`),
    UNIQUE INDEX `login`(`login`),
    INDEX `fk_tecnico_gestor`(`id_gestor`),
    PRIMARY KEY (`id_tecnico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assinatura` ADD CONSTRAINT `fk_assinatura_os` FOREIGN KEY (`numero_os`) REFERENCES `ordem_servico`(`numero_os`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordem_servico` ADD CONSTRAINT `fk_os_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordem_servico` ADD CONSTRAINT `fk_os_tecnico` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnico`(`id_tecnico`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `os_foto` ADD CONSTRAINT `fk_foto_os` FOREIGN KEY (`numero_os`) REFERENCES `ordem_servico`(`numero_os`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tecnico` ADD CONSTRAINT `fk_tecnico_gestor` FOREIGN KEY (`id_gestor`) REFERENCES `gestor`(`id_gestor`) ON DELETE RESTRICT ON UPDATE CASCADE;
