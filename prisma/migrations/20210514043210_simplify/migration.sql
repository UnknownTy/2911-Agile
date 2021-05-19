/*
  Warnings:

  - You are about to drop the `Stats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Stats` DROP FOREIGN KEY `Stats_ibfk_1`;

-- AlterTable
ALTER TABLE `Country` ADD COLUMN `stats` JSON;

-- DropTable
DROP TABLE `Stats`;
