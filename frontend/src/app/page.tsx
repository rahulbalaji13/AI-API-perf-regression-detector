import DashboardStats from '@/components/DashboardStats';
import MetricChart from '@/components/MetricChart';
import UploadForm from '@/components/UploadForm';
import EndpointHeatmap from '@/components/EndpointHeatmap';

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
            AI Regression Monitor
          </h1>
          <p className="text-slate-400">
            Real-time latency profiling and post-deployment anomaly detection based on Isolation Forests & Ruptures.
          </p>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <MetricChart />
        </div>
        
        <div className="col-span-1 space-y-8">
          <UploadForm />
          <EndpointHeatmap />
        </div>
      </div>

    </div>
  );
}
