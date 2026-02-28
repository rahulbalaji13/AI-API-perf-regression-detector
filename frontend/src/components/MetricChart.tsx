"use client";

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ComposedChart
} from 'recharts';
import { Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function MetricChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/metrics/timeseries`)
      .then(res => res.json())
      .then(d => {
        setData(d.map((item: any) => ({
          ...item,
          time: format(new Date(item.time), 'MMM dd HH:mm'),
          anomalyLatency: item.anomalies > 0 ? item.latency : null
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center bg-slate-800/50 rounded-2xl border border-slate-700/50 animate-pulse">
        <div className="flex flex-col items-center">
          <Activity className="w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
          <span className="text-slate-400">Loading model telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Global Latency Over Time
          </h3>
          <p className="text-sm text-slate-400 mt-1">Aggregated endpoint performance with detected regressions</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span className="text-slate-300">Avg Latency (ms)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-slate-300">Anomaly/Regression</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              tick={{fill: '#94a3b8', fontSize: 12}}
              tickMargin={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{fill: '#94a3b8', fontSize: 12}}
              tickFormatter={(val) => `${val}ms`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#f8fafc',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
            />
            <Line 
              type="monotone" 
              dataKey="latency" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#6366f1", stroke: "#e0e7ff", strokeWidth: 2 }}
            />
            <Scatter 
              dataKey="anomalyLatency" 
              fill="#f43f5e" 
              line={false}
              shape="circle"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
