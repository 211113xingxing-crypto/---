-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('individual', 'agency');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('pending', 'active', 'suspended');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "city" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "level" VARCHAR(20) NOT NULL,
    "parent_id" INTEGER,
    "slug" VARCHAR(100) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "geo_polygon" TEXT,

    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "service_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_service_type" (
    "provider_id" INTEGER NOT NULL,
    "service_type_id" INTEGER NOT NULL,

    CONSTRAINT "provider_service_type_pkey" PRIMARY KEY ("provider_id","service_type_id")
);

-- CreateTable
CREATE TABLE "service_provider" (
    "id" SERIAL NOT NULL,
    "provider_type" "ProviderType" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "wechat_id" VARCHAR(100),
    "avatar_url" VARCHAR(500),
    "bio" TEXT,
    "years_experience" INTEGER,
    "total_served" INTEGER NOT NULL DEFAULT 0,
    "avg_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address_text" VARCHAR(300),
    "district_id" INTEGER,
    "city_id" INTEGER NOT NULL,
    "status" "ProviderStatus" NOT NULL DEFAULT 'pending',
    "gender" VARCHAR(10),
    "age" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_listing" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "service_type_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "price_unit" VARCHAR(20),
    "price_note" VARCHAR(200),
    "is_negotiable" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "verify_type" VARCHAR(30) NOT NULL,
    "file_url" VARCHAR(500),
    "verify_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "verified_at" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_photo" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "caption" VARCHAR(200),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "openid" VARCHAR(100),
    "nickname" VARCHAR(100),
    "avatar_url" VARCHAR(500),
    "phone" VARCHAR(20),
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_verified_booking" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "user_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("user_id","provider_id")
);

-- CreateTable
CREATE TABLE "contact_request" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "contact_type" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "city_slug_key" ON "city"("slug");

-- CreateIndex
CREATE INDEX "district_parent_id_idx" ON "district"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "district_city_id_slug_key" ON "district"("city_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "service_type_slug_key" ON "service_type"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "service_provider_slug_key" ON "service_provider"("slug");

-- CreateIndex
CREATE INDEX "service_provider_city_id_status_idx" ON "service_provider"("city_id", "status");

-- CreateIndex
CREATE INDEX "service_provider_district_id_avg_rating_idx" ON "service_provider"("district_id", "avg_rating" DESC);

-- CreateIndex
CREATE INDEX "service_provider_provider_type_district_id_status_idx" ON "service_provider"("provider_type", "district_id", "status");

-- CreateIndex
CREATE INDEX "service_provider_status_idx" ON "service_provider"("status");

-- CreateIndex
CREATE INDEX "service_listing_provider_id_idx" ON "service_listing"("provider_id");

-- CreateIndex
CREATE INDEX "service_listing_service_type_id_is_active_idx" ON "service_listing"("service_type_id", "is_active");

-- CreateIndex
CREATE INDEX "verification_provider_id_idx" ON "verification"("provider_id");

-- CreateIndex
CREATE INDEX "provider_photo_provider_id_idx" ON "provider_photo"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_openid_key" ON "user"("openid");

-- CreateIndex
CREATE INDEX "review_provider_id_created_at_idx" ON "review"("provider_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "review_user_id_idx" ON "review"("user_id");

-- CreateIndex
CREATE INDEX "contact_request_provider_id_created_at_idx" ON "contact_request"("provider_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_service_type" ADD CONSTRAINT "provider_service_type_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_service_type" ADD CONSTRAINT "provider_service_type_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_provider" ADD CONSTRAINT "service_provider_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_provider" ADD CONSTRAINT "service_provider_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_listing" ADD CONSTRAINT "service_listing_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_listing" ADD CONSTRAINT "service_listing_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification" ADD CONSTRAINT "verification_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_photo" ADD CONSTRAINT "provider_photo_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_request" ADD CONSTRAINT "contact_request_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_request" ADD CONSTRAINT "contact_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
