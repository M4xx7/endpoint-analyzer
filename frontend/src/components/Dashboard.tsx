import { useState } from "react";
import { TimeRangeSelector } from "../components/TimeRangeSelector";
import { LatencyChart } from "../components/charts/LatencyChart";
import { StatusCodeChart } from "../components/charts/StatusCodeChart";
import { useFilteredData, type TimeRange } from "../utils/useTimeFilter";
import { calculateMetrics } from "../utils/metricsHelper";
import type { Request } from "../../../types";

export function Dashboard({ requests }: { requests: Request[] }) {
    const [timeRange, setTimeRange] = useState<TimeRange>("1D");
    const filteredData = useFilteredData(requests, timeRange);
    const metrics = calculateMetrics(filteredData);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-layout">

                <div className="dashboard-spacer"></div>

                {/* Main Dashboard Content Area */}
                <div className="dashboard-main">
                    {filteredData.length === 0 ? (
                        <div className="dashboard-empty">
                            <p className="dashboard-empty-text">
                                No requests found in the selected time period.
                            </p>
                        </div>
                    ) : (
                        <div className="dashboard-stack">

                            <div className="dashboard-section">
                                <div className="dashboard-chart-card">
                                    <h3 className="dashboard-chart-title">Latency</h3>
                                    <div className="chart-container">
                                        <LatencyChart data={filteredData} />
                                    </div>
                                </div>

                                <div className="dashboard-stats-row">
                                    <StatItem label="Median" value={`${metrics.latency.median} ms`} />
                                    <StatItem label="p95" value={`${metrics.latency.p95} ms`} />
                                    <StatItem label="Max" value={`${metrics.latency.max} ms`} />
                                </div>
                            </div>

                            <div className="dashboard-section">
                                <div className="dashboard-chart-card">
                                    <h3 className="dashboard-chart-title">Status Codes</h3>
                                    <div className="chart-container">
                                        <StatusCodeChart data={filteredData} />
                                    </div>
                                </div>

                                <div className="dashboard-stats-row">
                                    <StatItem
                                        label="Success rate"
                                        value={`${metrics.successRate.toFixed(2)} %`}
                                        valueClassName={metrics.successRate < 90 ? 'text-red-400' : 'text-green-400'}
                                    />
                                    <StatItem label="Total Requests" value={metrics.requestCount} valueClassName="text-gray-200" />
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                <div className="dashboard-sidebar">
                    <TimeRangeSelector timeRange={timeRange} onChange={setTimeRange} />
                </div>

            </div>
        </div>
    );
}

function StatItem({
    label,
    value,
    valueClassName = "text-indigo-400"
}: {
    label: string;
    value: string | number;
    valueClassName?: string
}) {
    return (
        <div className="stat-container">
            <div className="stat-name">{label}</div>
            <div className={`stat-value ${valueClassName}`}>{value}</div>
        </div>
    );
}