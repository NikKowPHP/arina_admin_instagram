import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, keyword, status } = await request.json();
    const updatedTrigger = await prisma.trigger.update({
      where: { id: params.id },
      data: { name, keyword, status },
    });
    return NextResponse.json(updatedTrigger);
  } catch (error) {
    console.error('Error updating trigger:', error);
    return NextResponse.json(
      { error: 'Failed to update trigger' },
      { status: 500 }
    );
  }
}