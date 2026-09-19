import { ApiLog } from "../../types";
import fs from "fs";

export function parseLogs(filePath: string): ApiLog[] {
    const file = fs.readFileSync(filePath, "utf-8");
    const logs: ApiLog[] = [];
    let errorCount = 0;

    const lines = file.split('\n').filter(Boolean);

    for (const line of lines) {
        try {
            const parsed = JSON.parse(line);
            if (isValidApiLog(parsed)) {
                logs.push(parsed);
            }
            else {
                errorCount++;
            }

        } catch (error) {
            errorCount++;
        }
    }

    if (errorCount > 0) {
        console.warn(`\x1b[33m\nWarning: Skipped ${errorCount} invalid log entry/entries.\x1b[0m`);
    }

    return logs;
}

function isValidApiLog(data: any): data is ApiLog {
    return (
        data !== null &&
        typeof data === 'object' &&
        typeof data.timestamp === 'string' &&
        typeof data.method === 'string' &&
        typeof data.path === 'string' &&
        typeof data.status === 'number' &&
        typeof data.duration === 'number'
    );
}