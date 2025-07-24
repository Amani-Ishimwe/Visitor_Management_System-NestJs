import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit{
    async onModuleInit() {
        await this.$connect();
        console.log('Database Postgres connected');
    }
    async onModuleDestroy() {
        await this.$disconnect();
        console.log('Database Postgres disconnected');
    }
}
