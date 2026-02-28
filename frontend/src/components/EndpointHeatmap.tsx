"use client";

import { useEffect, useState } from 'react';
import { AlertOctagon, Activity } from 'lucide-react';

export default function EndpointHeatmap() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/endpoints/heatmap`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm h-full">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-400" />
        Endpoint Health Heatmap
      </h3>
      
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No endpoint data available yet.</p>
        ) : (
          data.map((item, i) => {
            const isRegressed = item.anomalies > 5;
            return (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-slate-600 transition">
                <div>
                  <div className="font-mono text-sm text-slate-300 mb-1">{item.endpoint}</div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-slate-500">Avg: <span className="text-indigo-400 font-medium">{item.avg_latency}ms</span></span>
                    <span className="text-slate-500">Events: <span className={item.anomalies > 0 ? "text-rose-400 font-medium" : "text-emerald-400 font-medium"}>{item.anomalies}</span></span>
                  </div>
                </div>
                {isRegressed && (
                  <div className="flex items-center justify-center p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
