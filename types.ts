export type ApiLog = {
    timestamp: string;
    method: string;
    path: string;
    status: number;
    duration: number;
}

export type Latency = {
    max: number;
    median: number;
    p95: number;
}

export type Request = {
    timestamp: string;
    statusCode: number;
    duration: number;
}

export type EndpointStat = {
    method: string;
    route: string;
    successRate: number;
    requests: Request[];
    latency: Latency;
}




