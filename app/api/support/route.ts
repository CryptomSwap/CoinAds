import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const supportTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, priority, description } = supportTicketSchema.parse(body);

    // Create support ticket in AdminLog for internal tracking
    await prisma.adminLog.create({
      data: {
        action: 'SUPPORT_TICKET',
        details: JSON.stringify({
          subject,
          priority,
          description,
          userId: session.user.id,
          userEmail: session.user.email,
          timestamp: new Date().toISOString(),
        }),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Support ticket submitted successfully' 
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit support ticket' },
      { status: 500 }
    );
  }
}
