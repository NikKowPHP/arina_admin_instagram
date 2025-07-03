// file: src/lib/actions.ts

'use server';

import prisma from './prisma';
import { createClient } from './supabase-server';

export async function getTriggers(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  // NOTE: You don't have a `trigger` model in your schema with `name` and `status` fields.
  // This will cause a type error. I'm assuming the model should be `Trigger`.
  const [triggers, totalCount] = await Promise.all([
    prisma.trigger.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  return prisma.trigger.create({
    data: {
      postId: data.get('postId') as string,
      keyword: data.get('keyword') as string,
      userId: user.id,
      templateId: data.get('templateId') as string,
    },
  });
}

export async function updateTrigger(id: string, data: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  return prisma.trigger.update({
    where: { id },
    data: {
      postId: data.get('postId') as string,
      keyword: data.get('keyword') as string,
      userId: user.id,
      templateId: data.get('templateId') as string,
    },
  });
}

export async function deleteTrigger(id: string) {
  return prisma.trigger.delete({ where: { id } });
}

interface TemplateOption {
  id: string;
  name: string;
}

export async function getTemplates(): Promise<TemplateOption[]> {
  return prisma.template.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: 'asc'
    }
  });
}

// THIS IS A PLACEHOLDER. You don't have an `analytics` table.
// export async function getAnalytics() {
//   // You don't have an `analytics` model in your schema.
//   // This will fail. You should probably remove or implement this.
//   // For now, returning an empty array to prevent crashes.
//   return [];
// }
