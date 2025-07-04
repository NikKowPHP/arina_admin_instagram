// src/app/api/templates/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  if (!id) {
    // If no ID is provided, return an error
    return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
  }

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

export async function PUT(request: NextRequest, { params }: RouteParams) {
 
  const { id } = params
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

export async function DELETE(
  request: NextRequest
) {
  console.log('request', request);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // Delete all triggers associated with the template
      await prisma.trigger.deleteMany({
        where: { templateId: id },
      });

      // Then delete the template
      await prisma.template.delete({
        where: { id },
      });
    });
    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error: unknown ) {
    logger.error(`Error deleting template ${id}:`, error);
   
    return NextResponse.json({ error: 'Database error or template not found' }, { status: 500 });
  }
}