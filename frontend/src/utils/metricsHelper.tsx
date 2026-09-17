import type { EndpointMetrics, Request } from "../../../types";


export function calculateMetrics(requests: Request[]): EndpointMetrics {

    let endpointMetrics: EndpointMetrics = {
        latency: {
            max: 0,
            median: 0,
            p95: 0
        },
        successRate: 0,
        requestCount: 0
    }

    if (!requests || requests.length === 0) {
        return endpointMetrics;
    }

    const durations = requests.map(r => r.duration).sort((a, b) => a - b);

    const max = durations[durations.length - 1];

    const mid = Math.floor(durations.length / 2);
    const median = durations.length % 2 !== 0
        ? durations[mid]
        : (durations[mid - 1] + durations[mid]) / 2;

    const p95Index = Math.floor(durations.length * 0.95);
    const p95 = durations[p95Index];

    const successfulRequests = requests.filter(r => isSuccess(r.statusCode)).length;
    const successRate = (successfulRequests / requests.length) * 100;

    return {
        latency: {
            max: Math.round(max),
            p95: Math.round(p95),
            median: Math.round(median)
        },
        successRate,
        requestCount: requests.length
    }
}

function isSuccess(status: number): boolean {
    return status >= 200 && status < 400;
}