"use client";

import { GitCommit, Search, GitBranch } from 'lucide-react';

export default function DeploymentsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                        Deployment History
                    </h1>
                    <p className="text-slate-400">
                        Compare latency profiles and system stability across recorded deployment versions.
                    </p>
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search deployments..."
                        className="pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white w-64"
                    />
                </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-sm text-center">
                <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600/30">
                    <GitBranch className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Detailed Deployment Comparison is Coming Soon</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    We're currently building the advanced A/B comparison matrix view to give you deep insights into how code changes impact endpoint latencies. Check back on the next release!
                </p>
            </div>

        </div>
    );
}
