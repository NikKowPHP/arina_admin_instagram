import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    async onModuleInit() {
        await this.$connect(); // eslint-disable-line @typescript-eslint/no-unsafe-call
    }

    async onModuleDestroy() {
        await this.$disconnect(); // eslint-disable-line @typescript-eslint/no-unsafe-call
    }
}