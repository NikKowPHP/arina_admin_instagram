import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.trigger.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Trigger deleted successfully' });
  } catch (error) {
    console.error('Error deleting trigger:', error);
    return NextResponse.json(
      { error: 'Failed to delete trigger' },
      { status: 500 }
    );
  }
}