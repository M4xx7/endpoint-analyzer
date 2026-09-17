import { useState } from "react";
import { TimeRangeSelector } from "../components/charts/TimeRangeSelector";
import { LatencyChart } from "../components/charts/LatencyChart";
import { StatusCodeChart } from "../components/charts/StatusCodeChart";
import { useFilteredData, type TimeRange } from "../components/charts/useTimeFilter";
import { calculateMetrics } from "../utils/metricsHelper";
import type { Request } from "../../../types";

export function Dashboard({ requests }: { requests: Request[] }) {
    const [timeRange, setTimeRange] = useState<TimeRange>("1D");
    const filteredData = useFilteredData(requests, timeRange);
    const metrics = calculateMetrics(filteredData);

    return (
        <div className="w-full flex justify-center">
            
            <div className="flex flex-col-reverse md:flex-row gap-8 items-start w-full justify-center">

                <div className="hidden md:block w-56 shrink-0"></div>

                <div className="w-full max-w-[1000px] flex flex-col min-w-0">

                    {filteredData.length === 0 ? (
                        <div className="flex items-center justify-center w-full h-[300px]">
                            <p className="text-gray-400 text-lg font-medium">
                                No requests found in the selected time period.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-36 w-full">
                            <div className="flex flex-col w-full">
                                <div className="w-full bg-gray-900 rounded-xl border border-gray-800 p-6">
                                    <h3 className="text-gray-400 mb-4 font-semibold">Latency</h3>
                                    <div className="w-full h-[300px]">
                                        <LatencyChart data={filteredData} />
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-16 mt-6 px-2">
                                    <div className="stat-container">
                                        <div className="stat-name">Median</div>
                                        <div className="stat-value text-indigo-400">{metrics.latency.median} ms</div>
                                    </div>
                                    <div className="stat-container">
                                        <div className="stat-name">p95</div>
                                        <div className="stat-value text-indigo-400">{metrics.latency.p95} ms</div>
                                    </div>
                                    <div className="stat-container">
                                        <div className="stat-name">Max</div>
                                        <div className="stat-value text-indigo-400">{metrics.latency.max} ms</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <div className="w-full bg-gray-900 rounded-xl border border-gray-800 p-6">
                                    <h3 className="text-gray-400 mb-4 font-semibold">Status Codes</h3>
                                    <div className="w-full h-[300px]">
                                        <StatusCodeChart data={filteredData} />
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-16 mt-6 px-2">
                                    <div className="stat-container">
                                        <div className="stat-name">Success rate</div>
                                        <div className={`stat-value ${metrics.successRate < 90 ? 'text-red-400' : 'text-green-400'}`}>
                                            {metrics.successRate.toFixed(2)} %
                                        </div>
                                    </div>
                                    <div className="stat-container">
                                        <div className="stat-name">Total Requests</div>
                                        <div className="stat-value text-gray-200">{metrics.requestCount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-56 shrink-0 sticky top-8 flex flex-col gap-4">
                    <h3 className="text-gray-400 font-semibold uppercase tracking-wider text-sm mb-2">
                        Time Range
                    </h3>
                    <TimeRangeSelector timeRange={timeRange} onChange={setTimeRange} />
                </div>

            </div>
        </div>
    );
}