import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await context;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const template = await prisma.template.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, content: true, mediaUrl: true }
    });
    return NextResponse.json(template);
  } catch (error) {
    logger.error('Error fetching template:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await context;
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
    const template = await prisma.template.update({
      where: { id: params.id },
      data: { name, content, mediaUrl }
    });
    return NextResponse.json(template);
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await context;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.template.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}