import { useMemo } from "react";
import type { EndpointData } from "../../../types";
import { getMethodColor } from "../utils/methodColors";

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

    return (
        <div className="flex flex-col gap-6">
            <div className="overview-grid">
                <div className="overview-card">
                    <h3 className="overview-card-title">Error Rate</h3>
                    <div className="overview-list">
                        {highestErrorRates.map((ep, idx) => (
                            <div key={idx} className="overview-row">
                                <div className="overview-route-info truncate">
                                    <span className={`method-badge ${getMethodColor(ep.method)}`}>
                                        {ep.method}
                                    </span>
                                    <span className="text-gray-200 truncate" title={ep.route}>
                                        {ep.route}
                                    </span>
                                </div>
                                <div className="overview-metric-group">
                                    <span className="text-red-400">{ep.errorRate.toFixed(1)}%</span>
                                    <span className="text-gray-500 text-xs">{ep.count} reqs</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overview-card">
                    <h3 className="overview-card-title">Latency (Median)</h3>
                    <div className="overview-list">
                        {highestLatencies.map((ep, idx) => (
                            <div key={idx} className="overview-row">
                                <div className="overview-route-info truncate">
                                    <span className={`method-badge ${getMethodColor(ep.method)}`}>
                                        {ep.method}
                                    </span>
                                    <span className="text-gray-200 truncate" title={ep.route}>
                                        {ep.route}
                                    </span>
                                </div>
                                <div className="overview-metric-group">
                                    <span className="text-yellow-400">{ep.median} ms</span>
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