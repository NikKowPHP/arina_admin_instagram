-- CreateTable
CREATE TABLE "bot_status" (
    "id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "is_healthy" BOOLEAN NOT NULL DEFAULT false,
    "last_ping" TIMESTAMP(3) NOT NULL,
    "details" JSONB,

    CONSTRAINT "bot_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bot_status_service_name_key" ON "bot_status"("service_name");
