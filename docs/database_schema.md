// datasource db: postgresql

model User {
  id           String     @id @default(uuid())
  email        String     @unique
  createdAt    DateTime   @default(now()) @map("created_at")
  triggers     Trigger[]
  activityLogs ActivityLog[]

  @@map("users")
}

model Trigger {
  id         String   @id @default(uuid())
  postId     String   @map("post_id")
  keyword    String
  isActive   Boolean  @default(true) @map("is_active")
  createdAt  DateTime @default(now()) @map("created_at")
  userId     String   @map("user_id")
  templateId String   @map("template_id")

  user       User     @relation(fields: [userId], references: [id])
  template   Template @relation(fields: [templateId], references: [id])

  @@index([postId], name: "idx_triggers_post_id")
  @@index([keyword], name: "idx_triggers_keyword")
  @@map("triggers")
}

model Template {
  id        String   @id @default(uuid())
  content   String
  mediaUrl  String?  @map("media_url")
  metadata  Json?
  createdAt DateTime @default(now()) @map("created_at")
  triggers  Trigger[]

  @@map("templates")
}

model ActivityLog {
  id        String   @id @default(uuid())
  action    String
  details   Json?
  createdAt DateTime @default(now()) @map("created_at")
  userId    String   @map("user_id")

  user User @relation(fields: [userId], references: [id])

  @@map("activity_log")
}