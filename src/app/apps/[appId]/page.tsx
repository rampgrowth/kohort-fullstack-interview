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
  spendBreached: boolean;
  currentInstalls: number;
  baselineInstalls: number;
  installsChange: number;
  installsBreached: boolean;
  currentCpi: number;
  baselineCpi: number;
  cpiChange: number;
  cpiBreached: boolean;
  currentRevenue: number;
  baselineRevenue: number;
  revenueChange: number;
  revenueBreached: boolean;
}

const THRESHOLD = 10;

function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

function changeColor(change: number, invertColor = false): string {
  const isPositive = invertColor ? change < 0 : change > 0;
  if (Math.abs(change) < 0.1) return 'text-gray-500';
  return isPositive ? 'text-green-600' : 'text-red-600';
}

function MetricCell({
  current,
  baseline,
  change,
  breached,
  prefix = '$',
  decimals = 0,
  invertColor = false,
}: {
  current: number;
  baseline: number;
  change: number;
  breached: boolean;
  prefix?: string;
  decimals?: number;
  invertColor?: boolean;
}) {
  return (
    <>
      <td className="p-3 text-right">
        {prefix}{current.toFixed(decimals)}
      </td>
      <td className="p-3 text-right text-gray-400">
        {prefix}{baseline.toFixed(decimals)}
      </td>
      <td
        className={`p-3 text-right font-medium ${changeColor(change, invertColor)} ${
          breached ? 'bg-red-50' : ''
        }`}
      >
        {formatChange(change)}
        {breached && (
          <span className="text-xs text-red-400 ml-1">
            (&plusmn;{THRESHOLD}%)
          </span>
        )}
      </td>
    </>
  );
}

export default function AppDetailPage() {
  const params = useParams();
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [appName, setAppName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/apps/${params.appId}/campaigns`)
      .then((res) => res.json())
      .then((data) => {
        setAppName(data.appName);
        setCampaigns(data.campaigns);
        setLoading(false);
      });
  }, [params.appId]);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="max-w-7xl mx-auto p-8">
      <Link href="/" className="text-blue-500 text-sm mb-4 inline-block">
        &larr; Back to apps
      </Link>
      <h1 className="text-2xl font-bold mb-2">{appName}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Week-over-week comparison: last 7 days vs prior 7 days. Threshold:
        &plusmn;{THRESHOLD}%
      </p>

      {campaigns.length === 0 ? (
        <p className="text-gray-400">No campaigns found for this app.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg border text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2" colSpan={3}></th>
                <th className="text-center p-2 text-xs font-semibold uppercase tracking-wide text-gray-500" colSpan={3}>Spend</th>
                <th className="text-center p-2 text-xs font-semibold uppercase tracking-wide text-gray-500" colSpan={3}>Installs</th>
                <th className="text-center p-2 text-xs font-semibold uppercase tracking-wide text-gray-500" colSpan={3}>CPI</th>
                <th className="text-center p-2 text-xs font-semibold uppercase tracking-wide text-gray-500" colSpan={3}>Revenue</th>
              </tr>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3">Campaign</th>
                <th className="text-left p-3">Network</th>
                <th className="text-left p-3">Platform</th>
                <th className="text-right p-3">Current</th>
                <th className="text-right p-3 text-gray-400">Previous</th>
                <th className="text-right p-3">Change</th>
                <th className="text-right p-3">Current</th>
                <th className="text-right p-3 text-gray-400">Previous</th>
                <th className="text-right p-3">Change</th>
                <th className="text-right p-3">Current</th>
                <th className="text-right p-3 text-gray-400">Previous</th>
                <th className="text-right p-3">Change</th>
                <th className="text-right p-3">Current</th>
                <th className="text-right p-3 text-gray-400">Previous</th>
                <th className="text-right p-3">Change</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{c.name}</td>
                  <td className="p-3">{c.network}</td>
                  <td className="p-3">{c.platform}</td>
                  <MetricCell
                    current={c.currentSpend}
                    baseline={c.baselineSpend}
                    change={c.spendChange}
                    breached={c.spendBreached}
                  />
                  <MetricCell
                    current={c.currentInstalls}
                    baseline={c.baselineInstalls}
                    change={c.installsChange}
                    breached={c.installsBreached}
                    prefix=""
                  />
                  <MetricCell
                    current={c.currentCpi}
                    baseline={c.baselineCpi}
                    change={c.cpiChange}
                    breached={c.cpiBreached}
                    decimals={2}
                    invertColor
                  />
                  <MetricCell
                    current={c.currentRevenue}
                    baseline={c.baselineRevenue}
                    change={c.revenueChange}
                    breached={c.revenueBreached}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
