import { prisma } from '@/lib/prisma';
import { calculatePercentageChange } from '@/lib/metrics';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId } = await params;

  const campaigns = await prisma.campaign.findMany({
    where: { appId: Number(appId) },
    include: {
      metrics: {
        orderBy: { date: 'desc' },
        take: 14,
      },
    },
  });

  const summaries = campaigns.map((campaign) => {
    const sorted = [...campaign.metrics].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const current = sorted.slice(0, 7);
    const baseline = sorted.slice(7, 14);

    const sum = (arr: typeof current, key: 'spend' | 'installs' | 'revenue') =>
      arr.reduce((acc, m) => acc + m[key], 0);

    const currentSpend = sum(current, 'spend');
    const baselineSpend = sum(baseline, 'spend');
    const currentInstalls = sum(current, 'installs');
    const baselineInstalls = sum(baseline, 'installs');
    const currentRevenue = sum(current, 'revenue');
    const baselineRevenue = sum(baseline, 'revenue');

    const currentCpi =
      currentInstalls > 0 ? currentSpend / currentInstalls : 0;
    const baselineCpi =
      baselineInstalls > 0 ? baselineSpend / baselineInstalls : 0;

    return {
      id: campaign.id,
      name: campaign.name,
      network: campaign.network,
      platform: campaign.platform,
      currentSpend: Math.round(currentSpend * 100) / 100,
      baselineSpend: Math.round(baselineSpend * 100) / 100,
      spendChange: calculatePercentageChange(currentSpend, baselineSpend),
      currentInstalls,
      baselineInstalls,
      installsChange: calculatePercentageChange(
        currentInstalls,
        baselineInstalls
      ),
      currentCpi: Math.round(currentCpi * 100) / 100,
      baselineCpi: Math.round(baselineCpi * 100) / 100,
      cpiChange: calculatePercentageChange(currentCpi, baselineCpi),
      currentRevenue: Math.round(currentRevenue * 100) / 100,
      baselineRevenue: Math.round(baselineRevenue * 100) / 100,
      revenueChange: calculatePercentageChange(currentRevenue, baselineRevenue),
    };
  });

  return NextResponse.json(summaries);
}
