import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const apps = await prisma.app.findMany({
    include: {
      company: true,
      _count: { select: { campaigns: true } },
    },
  });

  return NextResponse.json(
    apps.map((app) => ({
      id: app.id,
      name: app.name,
      companyName: app.company.name,
      campaignCount: app._count.campaigns,
    }))
  );
}
