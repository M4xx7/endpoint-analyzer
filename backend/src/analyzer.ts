import { ApiLog, EndpointStat, Latency, Request } from "./types";



export function processLogs(logs: ApiLog[]): EndpointStat[] {

    type Accumulator = {
        method: string;
        route: string;
        requests: Request[];
        errorCount: number;
    }

    const statsMap = new Map<string, Accumulator>();

    for (const log of logs) {
        const normalizedPath = normalizePath(log.path);
        const key = `${log.method} ${normalizedPath}`;

        if (!statsMap.has(key)) {
            statsMap.set(key, {
                method: log.method,
                route: normalizedPath,
                errorCount: 0,
                requests: []
            });
        }

        const stat = statsMap.get(key)!;


        stat.requests.push({
            timestamp: log.timestamp,
            statusCode: log.status,
            duration: log.duration
        })

        if (isErrorStatus(log.status)) stat.errorCount++;
    }

    const results: EndpointStat[] = [];

    for (const stat of statsMap.values()) {
        results.push({
            method: stat.method,
            route: stat.route,
            successRate: getSuccessRate(stat.requests.length, stat.errorCount),
            requests: stat.requests,
            latency: getLatencyMetric(stat.requests.map(request => request.duration)),
        })

    }

    return results;
}

function normalizePath(path: string): string {
    return path.replace(/\d+/g, ":id");
}

function isErrorStatus(statusCode: number): boolean {
    return statusCode >= 400;
}

function getSuccessRate(totalCount: number, errorCount: number): number {
    return totalCount === 0 ? 0 : 100 - ((errorCount * 100) / totalCount);
}

function getLatencyMetric(durations: number[]): Latency {

    const sortedDurations = [...durations].sort((a, b) => a - b);
    const len = sortedDurations.length;

    if (len === 0) return { max: 0, median: 0, p95: 0 };

    const mid = Math.floor(len / 2);
    const median = len % 2 !== 0
        ? sortedDurations[mid]
        : (sortedDurations[mid - 1] + sortedDurations[mid]) / 2;

    const maxDur = sortedDurations[len - 1];
    const p95Index = Math.max(0, Math.ceil(0.95 * len) - 1);

    return {
        max: maxDur,
        median: median,
        p95: sortedDurations[p95Index]
    }
}
