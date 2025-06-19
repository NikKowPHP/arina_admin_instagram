import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTriggers() {
  return prisma.trigger.findMany();
}

export async function createTrigger(data: FormData) {
  return prisma.trigger.create({
    data: {
      name: data.get('name') as string,
      keyword: data.get('keyword') as string,
      status: data.get('status') as string,
    },
  });
}

export async function updateTrigger(id: string, data: FormData) {
  return prisma.trigger.update({
    where: { id },
    data: {
      name: data.get('name') as string,
      keyword: data.get('keyword') as string,
      status: data.get('status') as string,
    },
  });
}

export async function deleteTrigger(id: string) {
  return prisma.trigger.delete({ where: { id } });
}