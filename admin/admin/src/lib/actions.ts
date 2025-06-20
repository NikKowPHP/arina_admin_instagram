import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTriggers(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  const [triggers, totalCount] = await Promise.all([
    prisma.trigger.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' } // Assuming triggers are ordered by creation date
    }),
    prisma.trigger.count()
  ]);

  return {
    triggers,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page
  };
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