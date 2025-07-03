import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        storage: {
          getItem: async (key: string) => {
            const value = (await cookieStore).get(key)?.value;
            return value ?? null;
          },
          setItem: async (key: string, value: string) => {
            (await cookieStore).set(key, value);
          },
          removeItem: async (key: string) => {
            (await cookieStore).delete(key);
          },
        },
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const supabase = await getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = request.nextUrl.pathname.split('/').filter(Boolean).pop();
  
  try {
    if (slug) {
      const trigger = await prisma.trigger.findUnique({
        where: { id: slug }
      });
      return NextResponse.json(trigger);
    } else {
      const triggers = await prisma.trigger.findMany();
      return NextResponse.json(triggers);
    }
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { postId, keyword, userId, templateId } = body;

  if (!postId || !keyword || !userId || !templateId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const trigger = await prisma.trigger.create({
      data: { postId, keyword, userId, templateId }
    });
    return NextResponse.json(trigger, { status: 201 });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = request.nextUrl.pathname.split('/').filter(Boolean).pop();
  const body = await request.json();
  const { postId, keyword, userId, templateId, isActive } = body;

  if (!slug || !postId || !keyword || !userId || !templateId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const trigger = await prisma.trigger.update({
      where: { id: slug },
      data: { postId, keyword, userId, templateId, isActive }
    });
    return NextResponse.json(trigger);
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = request.nextUrl.pathname.split('/').filter(Boolean).pop();

  if (!slug) {
    return NextResponse.json({ error: 'Missing trigger ID' }, { status: 400 });
  }

  try {
    await prisma.trigger.delete({
      where: { id: slug }
    });
    return NextResponse.json({ message: 'Trigger deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
// ROO-AUDIT-TAG :: plan-010-api-integration.md :: END