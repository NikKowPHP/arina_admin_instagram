import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templates = await prisma.template.findMany({
      select: { id: true, name: true, content: true, mediaUrl: true }
    });
    return NextResponse.json(templates);
  } catch (error) {
    logger.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, content, mediaUrl } = body;

  if (!name || !content) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const template = await prisma.template.create({
      data: { name, content, mediaUrl }
    });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}