import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const errors = await prisma.deadLetterQueue.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(errors);
  } catch (error) {
    console.error('Error fetching dead letter queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dead letter queue' },
      { status: 500 }
    );
  }
}