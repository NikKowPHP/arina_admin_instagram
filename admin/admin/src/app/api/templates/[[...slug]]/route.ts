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

  const slug = request.nextUrl.pathname.split('/').filter(Boolean).pop();
  
  try {
    if (slug) {
      const template = await prisma.template.findUnique({
        where: { id: slug },
        select: { id: true, name: true, content: true, media_url: true }
      });
      return NextResponse.json(template);
    } else {
      const templates = await prisma.template.findMany({
        select: { id: true, name: true, content: true, media_url: true }
      });
      return NextResponse.json(templates);
    }
  } catch {
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
  const { name, content, media_url } = body;

  if (!name || !content) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const template = await prisma.template.create({
      data: { name, content, media_url }
    });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = request.nextUrl.pathname.split('/').filter(Boolean).pop();
  const body = await request.json();
  const { name, content, media_url } = body;

  if (!slug || !name || !content) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const template = await prisma.template.update({
      where: { id: slug },
      data: { name, content, media_url }
    });
    return NextResponse.json(template);
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = request.nextUrl.pathname.split('/').filter(Boolean).pop();

  if (!slug) {
    return NextResponse.json({ error: 'Missing template ID' }, { status: 400 });
  }

  try {
    await prisma.template.delete({
      where: { id: slug }
    });
    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}