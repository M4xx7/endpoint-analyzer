import React, { useMemo } from "react";
import type { EndpointData } from "../../../types";

type Props = {
    results: EndpointData[];
};

export function OverviewTab({ results }: Props) {
    const endpointMetrics = useMemo(() => {
        return results.map((endpoint) => {
            const reqs = endpoint.requests;
            const count = reqs.length;

            if (count === 0) {
                return { ...endpoint, errorRate: 0, median: 0, count: 0 };
            }

            const errorCount = reqs.filter((r) => r.statusCode >= 400).length;
            const errorRate = (errorCount / count) * 100;

            const sortedDurations = reqs.map((r) => r.duration).sort((a, b) => a - b);

            const mid = Math.floor(count / 2);
            const median = count % 2 !== 0
                ? sortedDurations[mid]
                : (sortedDurations[mid - 1] + sortedDurations[mid]) / 2;

            return {
                method: endpoint.method,
                route: endpoint.route,
                count,
                errorRate,
                median: Math.round(median),
            };
        });
    }, [results]);

    const highestErrorRates = [...endpointMetrics]
        .sort((a, b) => b.errorRate - a.errorRate)
        .slice(0, 5);

    const highestLatencies = [...endpointMetrics]
        .sort((a, b) => b.median - a.median)
        .slice(0, 5);

    const getMethodColor = (method: string) => {
        const colors: Record<string, string> = {
            GET: "text-blue-400 bg-blue-400/10 border-blue-400/20",
            POST: "text-green-400 bg-green-400/10 border-green-400/20",
            PUT: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
            DELETE: "text-red-400 bg-red-400/10 border-red-400/20",
        };
        return colors[method.toUpperCase()] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
    };

    return (
        <div className="flex flex-col gap-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-zinc-800 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-center text-gray-400 mb-4 font-semibold tracking-wider text-sm">
                        Error Rate
                    </h3>
                    <div className="flex flex-col gap-3">
                        {highestErrorRates.map((ep, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded-lg border border-gray-800/50">
                                <div className="flex items-center gap-3 truncate pr-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded border ${getMethodColor(ep.method)}`}>
                                        {ep.method}
                                    </span>
                                    <span className="text-gray-200 truncate" title={ep.route}>
                                        {ep.route}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end whitespace-nowrap">
                                    <span className="text-red-400 font-bold">{ep.errorRate.toFixed(1)}%</span>
                                    <span className="text-gray-500 text-xs">{ep.count} reqs</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-800 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-center text-gray-400 mb-4 font-semibold tracking-wider text-sm">
                        Latency (Median)
                    </h3>
                    <div className="flex flex-col gap-3">
                        {highestLatencies.map((ep, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded-lg border border-gray-800/50">
                                <div className="flex items-center gap-3 truncate pr-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded border ${getMethodColor(ep.method)}`}>
                                        {ep.method}
                                    </span>
                                    <span className="text-gray-200 truncate" title={ep.route}>
                                        {ep.route}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end whitespace-nowrap">
                                    <span className="text-yellow-400 font-bold">{ep.median} ms</span>
                                    <span className="text-gray-500 text-xs">{ep.count} reqs</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}