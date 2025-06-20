import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').filter(Boolean).pop();
    if (!id) {
      return NextResponse.json({ error: 'Missing trigger ID' }, { status: 400 });
    }
    await prisma.trigger.delete({
      where: { id }
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