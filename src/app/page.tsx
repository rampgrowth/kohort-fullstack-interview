'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface App {
  id: number;
  name: string;
  companyName: string;
  campaignCount: number;
}

export default function HomePage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/apps')
      .then((res) => res.json())
      .then((data) => {
        setApps(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Apps</h1>
      <div className="space-y-3">
        {apps.map((app) => (
          <Link
            key={app.id}
            href={`/apps/${app.id}`}
            className="block bg-white rounded-lg border p-4 hover:border-blue-400 transition-colors"
          >
            <div className="font-semibold">{app.name}</div>
            <div className="text-sm text-gray-500">
              {app.companyName} &middot; {app.campaignCount} campaigns
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
