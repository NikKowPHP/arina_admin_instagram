TODO: Full Project Migration to NestJS Stack
Project: Laravel to NestJS Instagram Bot Migration
Estimated Total Time: 28-35 hours (for 4b model, highly dependent on familiarity with NestJS/Prisma)
Files Affected: All new project files, Docker configuration files. (Approximately 50-70 new core files, excluding tests and minor configs)

Implementation Plan

the nest js app placed in ./nest-app
the laravel project that we need to migrate from is placed in ./ root directory 
SKIP ALL THE MIGRATIONS and code execution, just implementation . 
Phase 1: Core NestJS Setup & Database with Prisma (Est. 4-5 hours)

File: ./package.json

- [x] Initialize new Node.js project: `npm init -y`
- [x] Install NestJS CLI globally: `npm install -g @nestjs/cli`
- [x] Create new NestJS project: `nest new ./nest-app` (in the new project directory)
- [x] Install Prisma CLI and Client as dev dependencies: `npm install prisma --save-dev` and `npm install @prisma/client`
- [x] Install PostgreSQL driver `pg`: `npm install pg`
- [rx] Verify `package.json` includes `@nestjs/core`, `@nestjs/platform-express`, `prisma`, `@prisma/client`, `pg`, `reflect-metadata`, `rxjs`.
- [x] Test basic NestJS app startup: `npm run start:dev` should run without errors.

File: ./prisma/schema.prisma

- [x] Initialize Prisma: `npx prisma init --datasource-provider postgresql`
- [x] Configure database URL in `./.env` (created by `prisma init`): `DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"` (adjust for Docker later)
- [x] Define `User` model (for authentication later):
    ```prisma
    model User {
      id        Int      @id @default(autoincrement())
      email     String   @unique
      name      String?
      password  String
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
    ```
- [x] Define `PostTrigger` model, mirroring Laravel's `post_triggers` table:

    ```prisma
    model PostTrigger {
      id                Int      @id @default(autoincrement())
      instagramPostId   String   @map("instagram_post_id")
      keyword           String
      dmMessage         Json     @map("dm_message") // For structured DM content
      isActive          Boolean  @default(true) @map("is_active")
      createdAt         DateTime @default(now()) @map("created_at")
      updatedAt         DateTime @updatedAt @map("updated_at")

      @@index([instagramPostId])
    }
    ```

- [x] Verify schema syntax is correct.

File: Terminal / CLI

- [x] Create initial Prisma migration: `npx prisma migrate dev --name init`
- [x] This will create the database if it doesn't exist and apply the schema.
- [x] Generate Prisma Client: `npx prisma generate`
- [x] Verify migration files are created in `./prisma/migrations/` and Prisma client is updated in `node_modules/.prisma/client`.

File: ./src/prisma/prisma.service.ts

- [x] Create `PrismaService` to encapsulate Prisma Client:

    ```typescript
    import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
    import { PrismaClient } from "@prisma/client";

    @Injectable()
    export class PrismaService
        extends PrismaClient
        implements OnModuleInit, OnModuleDestroy
    {
        async onModuleInit() {
            await this.$connect();
        }

        async onModuleDestroy() {
            await this.$disconnect();
        }
    }
    ```

- [x] Ensure `PrismaService` connects and disconnects properly.

File: ./src/prisma/prisma.module.ts

- [x] Create `PrismaModule` to provide `PrismaService`:

    ```typescript
    import { Module } from "@nestjs/common";
    import { PrismaService } from "./prisma.service";

    @Module({
        providers: [PrismaService],
        exports: [PrismaService],
    })
    export class PrismaModule {}
    ```

- [x] Verify module structure is correct.

File: ./src/app.module.ts

- [x] Import `PrismaModule` into the root `AppModule`.
    ```typescript
    // Add PrismaModule to imports array
    // import { PrismaModule } from './prisma/prisma.module';
    // @Module({ imports: [PrismaModule, ...], ... })
    ```
- [x] Test application still runs: `npm run start:dev`.

Phase 2: Admin Panel API - PostTriggers CRUD & Authentication Backend (Est. 5-6 hours)

File: ./src/post-triggers/dto/create-post-trigger.dto.ts

- [x] Create `CreatePostTriggerDto` with validation (using `class-validator` and `class-transformer`, install them: `npm install class-validator class-transformer`):
    ```typescript
    // Example:
    // import { IsString, IsBoolean, IsNotEmpty, IsObject, IsOptional, IsUrl } from 'class-validator';
    // export class DmMessageDto { /* fields for media_url, media_type etc. */ }
    // export class CreatePostTriggerDto {
    //   @IsString() @IsNotEmpty() instagramPostId: string;
    //   @IsString() @IsNotEmpty() keyword: string;
    //   @IsObject() @IsNotEmpty() dmMessage: DmMessageDto; // Or Record<string, any> if structure is flexible
    //   @IsBoolean() @IsOptional() isActive?: boolean;
    // }
    ```
- [x] Define DTO for `dmMessage` structure (`media_url`, `media_type`, `description_text`, `cta_text`, `cta_url`).
- [x] Verify DTO reflects required and optional fields from Laravel's `CreateTrigger.php`.

File: ./src/post-triggers/dto/update-post-trigger.dto.ts

- [x] Create `UpdatePostTriggerDto` (similar to Create, but fields are optional using `@nestjs/mapped-types` or manual definition).
    ```typescript
    // import { PartialType } from '@nestjs/mapped-types'; // npm install @nestjs/mapped-types
    // import { CreatePostTriggerDto } from './create-post-trigger.dto';
    // export class UpdatePostTriggerDto extends PartialType(CreatePostTriggerDto) {}
    ```
- [x] Verify DTO allows partial updates.

File: ./src/post-triggers/entities/post-trigger.entity.ts

- [x] Create `PostTriggerEntity` (optional, but good for consistency, can map Prisma types or define class structure).
- [x] Verify entity matches Prisma model.

File: ./src/post-triggers/post-triggers.service.ts

- [x] Generate service: `nest g service post-triggers --flat` (or inside a `post-triggers` module).
- [x] Inject `PrismaService`.
- [x] Implement `create(createPostTriggerDto)` method.
- [x] Implement `findAll()` method with pagination (e.g., accept `skip`, `take` parameters).
- [x] Implement `findOne(id: number)` method.
- [x] Implement `update(id: number, updatePostTriggerDto)` method.
- [x] Implement `remove(id: number)` method.
- [x] Test service methods (manually or with stubs initially).

File: ./src/post-triggers/post-triggers.controller.ts

- [x] Generate controller: `nest g controller post-triggers --flat`.
- [x] Inject `PostTriggersService`.
- [x] Implement `@Post()` endpoint for creating triggers. Use `ValidationPipe`.
- [x] Implement `@Get()` endpoint for listing all triggers.
- [x] Implement `@Get(':id')` endpoint for fetching a single trigger.
- [x] Implement `@Patch(':id')` endpoint for updating a trigger. Use `ValidationPipe`.
- [x] Implement `@Delete(':id')` endpoint for deleting a trigger.
- [x] Test endpoints using Postman or curl.

File: ./src/post-triggers/post-triggers.module.ts

- [x] Generate module: `nest g module post-triggers`.
- [x] Declare `PostTriggersController` and `PostTriggersService` in this module. Import `PrismaModule`.
- [x] Import `PostTriggersModule` into `AppModule`.
- [x] Verify module dependencies and structure are correct.

File: ./src/auth/auth.module.ts

- [x] Generate `auth` module: `nest g module auth`.
- [x] Install JWT and Passport dependencies: `npm install @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt` and `npm install --save-dev @types/passport-jwt @types/bcrypt`.
- [x] Create `UsersModule` and `UsersService` (basic version for now, using `PrismaService`).
- [x] Configure `JwtModule.registerAsync` with `secret` and `signOptions` from `.env`.
- [x] Implement `AuthService` with `validateUser()` and `login()` methods.
- [x] Implement `JwtStrategy` extending `PassportStrategy(Strategy)`.
- [x] Implement `AuthController` with `/login` endpoint.
- [x] Import `AuthModule` into `AppModule`.

File: ./src/post-triggers/post-triggers.controller.ts (Revisit)

- [x] Protect all `PostTrigger` CRUD endpoints using `@UseGuards(JwtAuthGuard)`. Create `JwtAuthGuard`.
- [x] Test authentication protection on CRUD endpoints.

Phase 3: Admin Panel Frontend (Simple Server-Rendered with Handlebars) (Est. 6-7 hours)
_Note: This is a significant task. A separate SPA frontend would be more common but is a larger undertaking. This plan focuses on a simpler server-rendered UI for now._

File: ./src/main.ts

- [ ] Install Handlebars: `npm install hbs`
- [ ] Configure templating engine in `main.ts`:
    ```typescript
    // import { NestExpressApplication } from '@nestjs/platform-express';
    // import { join } from 'path';
    // const app = await NestFactory.create<NestExpressApplication>(AppModule);
    // app.useStaticAssets(join(__dirname, '..', 'public'));
    // app.setBaseViewsDir(join(__dirname, '..', 'views'));
    // app.setViewEngine('hbs');
    ```
- [ ] Create `views` directory in project root.
- [ ] Create `public` directory in project root for static assets.

File: ./views/layouts/admin.hbs

- [ ] Create a main layout file `admin.hbs`:
    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <title>Admin</title>
            <link rel="stylesheet" href="/css/tailwind.css" />
        </head>
        <body>
            <nav><!-- nav links --></nav>
            {{{body}}}
        </body>
    </html>
    ```
- [ ] Include placeholder for navigation (Login/Logout, Triggers link).
- [ ] Verify layout renders basic HTML structure.

File: ./tailwind.config.js

- [ ] Initialize Tailwind CSS: `npx tailwindcss init -p`
- [ ] Configure `content` in `tailwind.config.js` to scan `.hbs` files: `['./views/**/*.hbs', './src/**/*.ts']` (ts for any dynamic classes if needed).
- [ ] Create `./src/tailwind.css` (or `./public/css/tailwind-input.css`) with `@tailwind base; @tailwind components; @tailwind utilities;`.
- [ ] Add script to `package.json` to build Tailwind: `"build:css": "tailwindcss -i ./src/tailwind.css -o ./public/css/tailwind.css --watch"` (or similar for input/output paths).
- [ ] Run `npm run build:css` (or integrate into dev workflow).

File: ./src/admin/admin.controller.ts

- [ ] Create an `AdminController` (`nest g controller admin --flat` or within an `admin` module).
- [ ] Implement route for login page: `@Get('/login') @Render('auth/login') loginPage() { return {}; }`
- [ ] Implement route for registration page (if needed): `@Get('/register') @Render('auth/register') registerPage() { return {}; }`
- [ ] Create `views/auth/login.hbs` and `views/auth/register.hbs` with basic forms (Tailwind styled).
- [ ] Test rendering of login/register pages.

File: ./src/post-triggers/post-triggers.controller.ts (Revisit)

- [ ] Modify existing CRUD methods to render Handlebars views instead of returning JSON, or create new controller methods for the admin UI.
    - `@Get('/ui/triggers') @Render('admin/triggers/index') async listTriggersView() { const triggers = await this.service.findAll(); return { triggers }; }`
    - `@Get('/ui/triggers/create') @Render('admin/triggers/create') createTriggerView() { return {}; }`
    - `@Post('/ui/triggers/create') async handleCreateTrigger(@Body() dto, @Res() res) { await this.service.create(dto); res.redirect('/admin/ui/triggers'); }` (form handling will need Express-style req/res or specific NestJS patterns for redirects with server-rendered forms)
    - Similarly for edit and delete views/actions.
- [ ] Verify data is passed to views correctly.

File: ./views/admin/triggers/index.hbs

- [ ] Create `index.hbs` to list triggers in a table (Tailwind styled). Include "Create", "Edit", "Delete" links/buttons.
    ```html
    {{#each triggers}}
    <tr>
        <td>{{this.instagramPostId}}</td>
        <td><a href="/admin/ui/triggers/{{this.id}}/edit">Edit</a></td>
    </tr>
    {{/each}}
    ```
- [ ] Verify triggers are listed from the database.

File: ./views/admin/triggers/create.hbs

- [ ] Create `create.hbs` with a form for new triggers (Tailwind styled). Fields: `instagramPostId`, `keyword`, `dmMessage.media_url`, etc.
- [ ] Ensure form posts to the correct backend endpoint.

File: ./views/admin/triggers/edit.hbs

- [ ] Create `edit.hbs` similar to `create.hbs`, pre-filled with trigger data.
- [ ] Ensure form posts to the update endpoint.

Phase 4: Instagram Webhook Logic (Est. 4-5 hours)

File: ./src/instagram/dto/instagram-webhook.dto.ts

- [ ] Define DTOs for Instagram webhook payload structure (especially `entry`, `changes`, `value` for comments). This helps with validation and type safety.
    - Reference: `documentation/webhook_documentation.md` for payload structure.
- [ ] Verify DTOs match expected webhook structure.

File: ./src/instagram/webhook.service.ts

- [ ] Generate service: `nest g service instagram/webhook --flat`.
- [ ] Inject `PostTriggersService` and `PrismaService`.
- [ ] Implement `handleWebhookEvent(payload: any)` method.
    - Logic to parse payload, extract `mediaId`, `commentText`, `commenterId`.
    - Query `PostTrigger` model (using `PostTriggersService`) based on `mediaId` and `commentText` (keyword matching).
    - If trigger found, dispatch a job to send DM (Phase 5).
- [ ] Verify service logic for trigger matching is correct.

File: ./src/instagram/webhook.controller.ts

- [ ] Generate controller: `nest g controller instagram/webhook --flat`.
- [ ] Inject `WebhookService`.
- [ ] Implement `GET /webhook/instagram` for verification:
    ```typescript
    // @Get()
    // verify(@Query('hub.mode') mode: string, @Query('hub.verify_token') token: string, @Query('hub.challenge') challenge: string) {
    //   const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
    //   if (mode === 'subscribe' && token === VERIFY_TOKEN) { return challenge; } else { throw new ForbiddenException(); }
    // }
    ```
- [ ] Implement `POST /webhook/instagram` for event handling:
    ```typescript
    // @Post()
    // @HttpCode(200) // Important for Instagram to acknowledge receipt
    // handleEvent(@Req() req: Request, @Body() payload: any) { // Consider using a DTO with ValidationPipe for payload
    //   // 1. Verify X-Hub-Signature-256 (Create a custom guard or middleware)
    //   // 2. Call this.webhookService.handleWebhookEvent(payload);
    //   return 'EVENT_RECEIVED';
    // }
    ```
- [ ] Implement signature verification for `POST` (e.g., a custom Guard or middleware).
    - Use `crypto.createHmac('sha256', process.env.FACEBOOK_APP_SECRET).update(rawBody).digest('hex');`
    - Note: Need `rawBody` from request. Enable it in `main.ts`: `app.useBodyParser('json', { verify: (req, res, buf) => { req.rawBody = buf; } });` or similar.
- [ ] Add `.env` variables: `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`, `FACEBOOK_APP_SECRET`.
- [ ] Test verification endpoint and basic POST handling (mocking service call).

File: ./src/instagram/instagram.module.ts

- [ ] Generate module: `nest g module instagram`.
- [ ] Declare `WebhookController`, `WebhookService`. Import `PostTriggersModule`, `PrismaModule`.
- [ ] Import `InstagramModule` into `AppModule`.
- [ ] Verify module setup.

Phase 5: Instagram DM Sending & Job Queue (Est. 4-5 hours)

File: ./src/instagram/api.service.ts

- [ ] Generate service: `nest g service instagram/api --flat`.
- [ ] Install HTTP client: `npm install @nestjs/axios axios`. Import `HttpModule` in `InstagramModule`.
- [ ] Inject `HttpService` from `@nestjs/axios`.
- [ ] Implement `sendDm(recipientId: string, messagePayload: any)` method.
    - Logic to make POST request to Facebook Graph API (`https://graph.facebook.com/v19.0/me/messages`).
    - Use `process.env.INSTAGRAM_PAGE_ACCESS_TOKEN`.
    - Replicate DM payload construction from Laravel's `SendInstagramDmJob.php`, including generic templates for media or text messages, based on `trigger.dmMessage` content.
    - Reference `documentation/instagram_telegram_integration_guide.md` for payload examples.
- [ ] Add `INSTAGRAM_PAGE_ACCESS_TOKEN` to `.env`.
- [ ] Test DM sending logic (can be mocked or with a test recipient if API access is available).

File: ./src/queues/instagram-dm.processor.ts

- [ ] Install Bull and related packages: `npm install @nestjs/bull bull`.
- [ ] Generate a processor for Instagram DMs (e.g., `InstagramDmProcessor`).
    ```typescript
    // import { Processor, Process } from '@nestjs/bull';
    // import { Job } from 'bull';
    // import { InstagramApiService } from '../instagram/api.service'; // Adjust path
    // @Processor('instagram-dm-queue')
    // export class InstagramDmProcessor {
    //   constructor(private readonly instagramApiService: InstagramApiService) {}
    //   @Process('send-dm-job')
    //   async handleSendDm(job: Job<{ recipientId: string; triggerData: any }>) {
    //     // Construct messagePayload from job.data.triggerData.dmMessage
    //     // await this.instagramApiService.sendDm(job.data.recipientId, messagePayload);
    //   }
    // }
    ```
- [ ] Inject `InstagramApiService`.
- [ ] Define `handleSendDm` method that calls `instagramApiService.sendDm`.
- [ ] Verify job processing logic.

File: ./src/queues/queues.module.ts

- [ ] Create `QueuesModule`.
- [ ] Configure `BullModule.forRootAsync` (Redis connection details from `.env`).
- [ ] Register queue: `BullModule.registerQueue({ name: 'instagram-dm-queue' })`.
- [ ] Include `InstagramDmProcessor` in providers. Export `BullModule`.
- [ ] Import `QueuesModule` into `InstagramModule` (or wherever jobs are dispatched).
- [ ] Verify queue module setup.

File: ./src/instagram/webhook.service.ts (Revisit)

- [ ] Inject Bull queue: `@InjectQueue('instagram-dm-queue') private dmQueue: Queue`.
- [ ] Instead of calling `InstagramApiService` directly, add job to queue:
      `await this.dmQueue.add('send-dm-job', { recipientId, triggerData: trigger });`
- [ ] Test job dispatching.

Phase 6: Dockerization & Finalization (Est. 3-4 hours)

File: ./Dockerfile

- [ ] Create `Dockerfile` for NestJS application.
    - Base on `node:<version>-alpine`.
    - Copy `package.json`, `package-lock.json`.
    - Run `npm install --production`.
    - Copy `dist` folder and `prisma` folder (for schema and migrations).
    - Expose port (e.g., 3000).
    - Set `CMD ["node", "dist/main"]`.
    - Ensure Prisma generate is run if not part of build: `RUN npx prisma generate`.
    - Handle `node_modules` caching for faster builds.
- [ ] Test Docker image build.

File: ./docker-compose.yml

- [ ] Remove Laravel and Apache services.
- [ ] Add NestJS service (`app`):
    - Build from `Dockerfile`.
    - Mount volumes for development (`src`, `prisma`, etc.).
    - Set environment variables (including `DATABASE_URL` for Prisma).
    - Port mapping (e.g., `3000:3000`).
    - Depends on `db` (PostgreSQL) and `redis` (for Bull).
- [ ] Keep PostgreSQL service (`db`), ensure environment variables match Prisma's `DATABASE_URL`.
- [ ] Add Redis service for Bull queue.
- [ ] Update network configuration if needed.
- [ ] Test `docker-compose up` with new NestJS setup.

File: ./.env

- [ ] Ensure all necessary env vars are present: `DATABASE_URL`, `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`, `FACEBOOK_APP_SECRET`, `INSTAGRAM_PAGE_ACCESS_TOKEN`, `JWT_SECRET`, `REDIS_HOST`, `REDIS_PORT`.
- [ ] Verify env vars are correctly read by the application.

File: ./src/main.ts (Revisit)

- [ ] Add global `ValidationPipe`: `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));`.
- [ ] Configure CORS if admin UI is a separate SPA: `app.enableCors();`.
- [ ] Verify global pipes and configurations are set.

Phase 7: Testing & Refinement (Est. 4-5 hours)

File: ./test/post-triggers.e2e-spec.ts

- [ ] Write E2E tests for `PostTriggersController` CRUD endpoints.
    - Setup test database.
    - Test create, read, update, delete operations.
    - Test authentication protection.
- [ ] Verify E2E tests pass.

File: ./src/post-triggers/post-triggers.service.spec.ts

- [ ] Write unit tests for `PostTriggersService` methods.
    - Mock `PrismaService`.
- [ ] Verify unit tests pass.

File: ./test/instagram-webhook.e2e-spec.ts

- [ ] Write E2E tests for Instagram webhook endpoints (`/webhook/instagram`).
    - Test `GET` verification.
    - Test `POST` event handling (mock payload, mock signature verification, mock job dispatch).
- [ ] Verify E2E tests pass.

File: ./src/instagram/webhook.service.spec.ts

- [ ] Write unit tests for `WebhookService`.
    - Mock `PostTriggersService` and Bull `Queue`.
- [ ] Verify unit tests pass.

Manual Testing:

- [ ] Manually test admin panel UI (login, CRUD for triggers).
- [ ] Manually test webhook flow using a tool like `ngrok` and sample Instagram payloads.
    - Verify DM job is queued.
    - Verify DM sending (if API access is configured and working).
- [ ] Verify all features from original Laravel app are working.

Validation Checklist

- [ ] All NestJS services and controllers compile without TypeScript errors.
- [ ] Docker Compose environment builds and runs successfully.
- [ ] Prisma migrations apply correctly to PostgreSQL.
- [ ] Admin Panel API endpoints (CRUD for Triggers) work as expected and are protected by auth.
- [ ] (If Server-Rendered UI Implemented) Admin panel UI allows managing triggers.
- [ ] Instagram webhook verification (`GET`) responds correctly.
- [ ] Instagram webhook event handling (`POST`) processes payloads, verifies signatures, and queues DM jobs.
- [ ] DMs are constructed with correct media/text/CTA from `dmMessage` and sent (or job data is correct).
- [ ] Job queue processes DM jobs.
- [ ] Code follows NestJS conventions and best practices.
- [ ] All relevant environment variables are documented and used.

Ready for Implementation
This todo list is optimized for 4b AI models. Each task is:
✅ Self-contained and specific
✅ Includes clear validation criteria
✅ References exact file locations
✅ Estimated at 10-15 minutes completion time (per individual checkbox, though some like "Implement service" are umbrella tasks for multiple checkboxes)
