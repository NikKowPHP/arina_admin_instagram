import { PrismaClient } from '@prisma/client'

export type Database = typeof PrismaClient
export type User = PrismaClient['user']
export type Trigger = PrismaClient['trigger']
export type Template = PrismaClient['template']
export type ActivityLog = PrismaClient['activityLog']