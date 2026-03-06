import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

async function main() {
  await prisma.campaignMetric.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.app.deleteMany();
  await prisma.company.deleteMany();

  const company = await prisma.company.create({
    data: { name: 'Acme Games' },
  });

  const app = await prisma.app.create({
    data: { name: 'Puzzle Quest', companyId: company.id },
  });

  const campaigns = [
    { name: 'FB_US_IOS_PUZZLE_12345', network: 'Facebook', platform: 'ios' },
    { name: 'FB_CA_IOS_PUZZLE_12345', network: 'Facebook', platform: 'ios' },
    { name: 'GOOG_US_AND_PUZZLE_67890', network: 'Adwords', platform: 'android' },
    { name: 'MOL_US_IOS_PUZZLE_99999', network: 'MOLOCO', platform: 'ios' },
  ];

  for (const c of campaigns) {
    const campaign = await prisma.campaign.create({
      data: { ...c, appId: app.id },
    });

    // Generate 14 days of metrics (baseline: days 13-7, current: days 6-0)
    const metrics = [];
    for (let day = 13; day >= 0; day--) {
      // Current period has ~20% more spend to create noticeable changes
      const isCurrentPeriod = day <= 6;
      const baseSpend = randomBetween(800, 1200);
      const spend = isCurrentPeriod ? baseSpend * 1.2 : baseSpend;
      const installs = Math.round(spend / randomBetween(1.2, 1.8));
      const revenue = installs * randomBetween(0.3, 0.6);

      metrics.push({
        campaignId: campaign.id,
        date: daysAgo(day),
        spend,
        installs,
        revenue,
      });
    }

    await prisma.campaignMetric.createMany({ data: metrics });
  }

  console.log('Seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
