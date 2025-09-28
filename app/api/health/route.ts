import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Require health token for authentication
  const healthToken = request.headers.get('x-health-token');
  if (healthToken !== process.env.HEALTH_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbTime = Date.now() - startTime;
    
    return NextResponse.json({ 
      ok: true, 
      db: "connected",
      time: dbTime
    });
  } catch (e: any) {
    return NextResponse.json({ 
      ok: false, 
      error: e.message,
      time: null
    }, { status: 500 });
  }
}