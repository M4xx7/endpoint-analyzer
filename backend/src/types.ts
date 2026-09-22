export type ApiLog = {
    timestamp: string;
    method: string;
    path: string;
    status: number;
    duration: number;
}

export type EndpointData = {
    method: string;
    route: string;
    requests: Request[];
}

export type Request = {
    timestamp: string;
    statusCode: number;
    duration: number;
}

export type EndpointMetrics = {
    latency: Latency;
    successRate: number;
    requestCount: number;
}

export type Latency = {
    max: number;
    median: number;
    p95: number;
}











