/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `auth_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `role_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- DropIndex
DROP INDEX "users_auth_id_key";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "auth_id",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "given_name" DROP NOT NULL,
ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "role_id" SET NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("id");
