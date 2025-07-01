-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triggers" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,

    CONSTRAINT "triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "media_url" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_comments" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_matches" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "matched_text" VARCHAR(100) NOT NULL,
    "full_comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dead_letter_queue" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "error_message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dead_letter_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_triggers_post_id" ON "triggers"("post_id");

-- CreateIndex
CREATE INDEX "idx_triggers_keyword" ON "triggers"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "processed_comments_comment_id_key" ON "processed_comments"("comment_id");

-- CreateIndex
CREATE INDEX "idx_processed_comments_post_id" ON "processed_comments"("post_id");

-- CreateIndex
CREATE INDEX "idx_comment_matches_post_id" ON "comment_matches"("post_id");

-- CreateIndex
CREATE INDEX "idx_comment_matches_keyword" ON "comment_matches"("keyword");

-- AddForeignKey
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

