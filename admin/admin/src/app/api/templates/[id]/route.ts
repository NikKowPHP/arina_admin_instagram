// src/app/api/templates/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

// --- GET: Handles fetching all templates OR a single template by ID ---
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');

  try {
    // If an ID is provided, fetch a single template
    if (id) {
      const template = await prisma.template.findUnique({
        where: { id },
        select: { id: true, name: true, content: true, mediaUrl: true }
      });
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }
      return NextResponse.json(template);
    } 
    
    // If no ID is provided, fetch all templates
    else {
      const templates = await prisma.template.findMany({
        select: { id: true, name: true, content: true, mediaUrl: true }
      });
      return NextResponse.json(templates);
    }
  } catch (error) {
    logger.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// --- POST: Handles creating a new template ---
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
      { error: 'Missing required fields: name and content' },
      { status: 400 }
    );
  }

  try {
    const template = await prisma.template.create({
      data: { name, content, mediaUrl }
    });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    logger.error('Error creating template:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// --- PUT: Handles updating a template by ID ---
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
  }

  const body = await request.json();
  const { name, content, mediaUrl } = body;

  if (!name || !content) {
    return NextResponse.json(
      { error: 'Missing required fields: name and content' },
      { status: 400 }
    );
  }

  try {
    const template = await prisma.template.update({
      where: { id },
      data: { name, content, mediaUrl }
    });
    return NextResponse.json(template);
  } catch (error) {
    logger.error(`Error updating template ${id}:`, error);
    return NextResponse.json({ error: 'Database error or template not found' }, { status: 500 });
  }
}

// --- DELETE: Handles deleting a template by ID ---
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
  }

  try {
    await prisma.template.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting template ${id}:`, error);
    return NextResponse.json({ error: 'Database error or template not found' }, { status: 500 });
  }
}