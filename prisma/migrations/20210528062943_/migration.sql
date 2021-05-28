/*
  Warnings:

  - You are about to drop the column `flag` on the `Country` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Country` DROP COLUMN `flag`,
    ADD COLUMN `countryInfo` JSON;
