'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface CampaignSummary {
  id: number;
  name: string;
  network: string;
  platform: string;
  currentSpend: number;
  baselineSpend: number;
  spendChange: number;
  currentInstalls: number;
  baselineInstalls: number;
  installsChange: number;
  currentCpi: number;
  baselineCpi: number;
  cpiChange: number;
  currentRevenue: number;
  baselineRevenue: number;
  revenueChange: number;
}

const THRESHOLD = 10; // +/- 10%

function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

function changeColor(change: number, invertColor = false): string {
  const isPositive = invertColor ? change < 0 : change > 0;
  if (Math.abs(change) < 0.1) return 'text-gray-500';
  return isPositive ? 'text-green-600' : 'text-red-600';
}

export default function AppDetailPage() {
  const params = useParams();
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/apps/${params.appId}/campaigns`)
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      });
  }, [params.appId]);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="max-w-6xl mx-auto p-8">
      <Link href="/" className="text-blue-500 text-sm mb-4 inline-block">
        &larr; Back to apps
      </Link>
      <h1 className="text-2xl font-bold mb-6">Campaigns</h1>
      <p className="text-sm text-gray-500 mb-4">
        Week-over-week comparison: last 7 days vs prior 7 days. Threshold:
        &plusmn;{THRESHOLD}%
      </p>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg border text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Campaign</th>
              <th className="text-left p-3">Network</th>
              <th className="text-left p-3">Platform</th>
              <th className="text-right p-3">Spend</th>
              <th className="text-right p-3">Change</th>
              <th className="text-right p-3">Installs</th>
              <th className="text-right p-3">Change</th>
              <th className="text-right p-3">CPI</th>
              <th className="text-right p-3">Change</th>
              <th className="text-right p-3">Revenue</th>
              <th className="text-right p-3">Change</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{c.name}</td>
                <td className="p-3">{c.network}</td>
                <td className="p-3">{c.platform}</td>
                <td className="p-3 text-right">
                  ${c.currentSpend.toFixed(0)}
                </td>
                <td className={`p-3 text-right font-medium ${changeColor(c.spendChange)}`}>
                  {formatChange(c.spendChange)}
                </td>
                <td className="p-3 text-right">{c.currentInstalls}</td>
                <td className={`p-3 text-right font-medium ${changeColor(c.installsChange)}`}>
                  {formatChange(c.installsChange)}
                </td>
                <td className="p-3 text-right">
                  ${c.currentCpi.toFixed(2)}
                </td>
                <td className={`p-3 text-right font-medium ${changeColor(c.cpiChange, true)}`}>
                  {formatChange(c.cpiChange)}
                </td>
                <td className="p-3 text-right">
                  ${c.currentRevenue.toFixed(0)}
                </td>
                <td className={`p-3 text-right font-medium ${changeColor(c.revenueChange)}`}>
                  {formatChange(c.revenueChange)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
