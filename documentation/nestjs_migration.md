TODO: Full Project Migration to NestJS Stack
Project: Laravel to NestJS Instagram Bot Migration
Estimated Total Time: 28-35 hours (for 4b model, highly dependent on familiarity with NestJS/Prisma)
Files Affected: All new project files, Docker configuration files. (Approximately 50-70 new core files, excluding tests and minor configs)

Implementation Plan

the nest js app placed in ./nest-app
the laravel project that we need to migrate from is placed in ./ root directory 
SKIP ALL THE MIGRATIONS and code execution, just implementation . 
Phase 1: Core NestJS Setup & Database with Prisma (Est. 4-5 hours)

...

Phase 4: Instagram Webhook Logic (Est. 4-5 hours)

File: ./src/instagram/dto/instagram-webhook.dto.ts

- [x] Define DTOs for Instagram webhook payload structure (especially `entry`, `changes`, `value` for comments). This helps with validation and type safety.
    - Reference: `documentation/webhook_documentation.md` for payload structure.
- [x] Verify DTOs match expected webhook structure.

File: ./src/instagram/webhook.service.ts

- [x] Generate service: `nest g service instagram/webhook --flat`.
- [x] Inject `PostTriggersService` and `PrismaService`.
- [x] Implement `handleWebhookEvent(payload: any)` method.
    - Logic to parse payload, extract `mediaId`, `commentText`, `commenterId`.
    - Query `PostTrigger` model (using `PostTriggersService`) based on `mediaId` and `commentText` (keyword matching).
    - If trigger found, dispatch a job to send DM (Phase 5).
- [x] Verify service logic for trigger matching is correct.

File: ./src/instagram/webhook.controller.ts

- [x] Generate controller: `nest g controller instagram/webhook --flat`.
- [x] Inject `WebhookService`.
- [x] Implement `GET /webhook/instagram` for verification:
- [x] Implement `POST /webhook/instagram` for event handling:
- [x] Implement signature verification for `POST` (e.g., a custom Guard or middleware).
    - Use `crypto.createHmac('sha256', process.env.FACEBOOK_APP_SECRET).update(rawBody).digest('hex');`
    - Note: Need `rawBody` from request. Enable it in `main.ts`: `app.useBodyParser('json', { verify: (req, res, buf) => { req.rawBody = buf; } });` or similar.
- [x] Add `.env` variables: `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`, `FACEBOOK_APP_SECRET`.
- [x] Test verification endpoint and basic POST handling (mocking service call).

File: ./src/instagram/instagram.module.ts

- [x] Generate module: `nest g module instagram`.
- [x] Declare `WebhookController`, `WebhookService`. Import `PostTriggersModule`, `PrismaModule`.
- [x] Import `InstagramModule` into `AppModule`.
- [x] Verify module setup.

Phase 5: Instagram DM Sending & Job Queue (Est. 4-5 hours)
...
