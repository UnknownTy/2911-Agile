-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL,
    `stats` JSON,
    `flag` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Country.name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `restauraunt` VARCHAR(191),
    `indoor` VARCHAR(191),
    `outdoor` VARCHAR(191),
    `masks` VARCHAR(191),
    `link` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
