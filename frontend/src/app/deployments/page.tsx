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

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm overflow-hidden mt-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700/50 bg-slate-900/50 text-sm font-medium text-slate-400">
                            <th className="py-4 px-6">Deployment Version</th>
                            <th className="py-4 px-6">Total Endpoints</th>
                            <th className="py-4 px-6 text-right">Avg Response Time</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-slate-700/30 hover:bg-slate-700/20 transition group">
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition">
                                        <GitCommit className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-white mb-0.5">v2.1.0</div>
                                        <div className="text-xs text-slate-500">Latest Release</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-6 text-slate-300">5 Active</td>
                            <td className="py-4 px-6 text-right">
                                <span className="font-mono text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md">195.4ms</span>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-700/20 transition group">
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-slate-700 transition">
                                        <GitCommit className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-300 mb-0.5">v2.0.0</div>
                                        <div className="text-xs text-slate-500">Previous Release</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-6 text-slate-300">5 Active</td>
                            <td className="py-4 px-6 text-right">
                                <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">88.2ms</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}
