import EndpointHeatmap from '@/components/EndpointHeatmap';

export default function EndpointsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                        Endpoint Registry
                    </h1>
                    <p className="text-slate-400">
                        Current status and historical severity of all monitored API endpoints.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EndpointHeatmap />
            </div>

        </div>
    );
}
