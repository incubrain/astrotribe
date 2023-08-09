-- CreateTable
CREATE TABLE "seo_data" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "scrape_date" TIMESTAMP(3) NOT NULL,
    "general" JSONB NOT NULL,
    "organic" JSONB NOT NULL,
    "ads" JSONB NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "seo_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_seodata_keyword" ON "seo_data"("keyword");

-- CreateIndex
CREATE INDEX "idx_seodata_date" ON "seo_data"("scrape_date");

-- CreateIndex
CREATE INDEX "idx_seodata_country" ON "seo_data"("country");

-- CreateIndex
CREATE INDEX "idx_seodata_domain" ON "seo_data"("domain");
