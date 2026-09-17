import { ApiLog, EndpointData, Request } from "../../types";


export function processLogs(logs: ApiLog[]): EndpointData[] {

    type Accumulator = {
        method: string;
        route: string;
        requests: Request[];
    }

    const statsMap = new Map<string, Accumulator>();

    for (const log of logs) {
        const normalizedPath = normalizePath(log.path);
        const key = `${log.method} ${normalizedPath}`;

        if (!statsMap.has(key)) {
            statsMap.set(key, {
                method: log.method,
                route: normalizedPath,
                requests: []
            });
        }

        const stat = statsMap.get(key)!;


        stat.requests.push({
            timestamp: log.timestamp,
            statusCode: log.status,
            duration: log.duration
        })

    }

    const results: EndpointData[] = [];

    for (const stat of statsMap.values()) {
        results.push({
            method: stat.method,
            route: stat.route,
            requests: stat.requests,
        })
    }

    return results;
}

function normalizePath(path: string): string {
    return path.replace(/\d+/g, ":id");
}


