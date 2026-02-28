"use client";

import { Activity, AlertTriangle, GitMerge, Server } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalEndpoints: 0,
    totalRequests: 0,
    totalAnomalies: 0,
    avgLatency: 0
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/dashboard/summary`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  const cards = [
    { title: "Monitored Endpoints", value: stats.totalEndpoints, icon: Server, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "Processed Requests", value: stats.totalRequests.toLocaleString(), icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: "Avg Latency", value: `${stats.avgLatency}ms`, icon: GitMerge, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
    { title: "Detected Anomalies", value: stats.totalAnomalies, icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <div key={i} className={`p-6 rounded-2xl border ${card.bg} backdrop-blur-sm relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold tracking-tight text-white">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-slate-900/50 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
