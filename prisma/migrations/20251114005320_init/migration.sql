-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "user_name" TEXT NOT NULL,
    "email" TEXT,
    "submitted_by" TEXT DEFAULT 'anonymous',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_assets" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "asset_type" TEXT NOT NULL,
    "project_index" INTEGER,
    "alt_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "submission_assets_submission_id_idx" ON "submission_assets"("submission_id");

-- AddForeignKey
ALTER TABLE "submission_assets" ADD CONSTRAINT "submission_assets_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
