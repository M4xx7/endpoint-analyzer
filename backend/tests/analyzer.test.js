"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const analyzer_1 = require("../src/analyzer");
(0, vitest_1.describe)('processLogs', () => {
    (0, vitest_1.it)('should aggregate identical normalized paths', () => {
        const logs = [
            { method: 'GET', path: '/books/1', status: 200, duration: 100 },
            { method: 'GET', path: '/books/2', status: 200, duration: 150 },
            { method: 'POST', path: '/books', status: 201, duration: 200 }
        ];
        const results = (0, analyzer_1.processLogs)(logs);
        (0, vitest_1.expect)(results).toHaveLength(2);
        const getBooks = results.find(r => r.method === 'GET');
        (0, vitest_1.expect)(getBooks?.route).toBe('/books/:id');
        (0, vitest_1.expect)(getBooks?.requestCount).toBe(2);
    });
    (0, vitest_1.it)('should calculate success rate correctly', () => {
        const logs = [
            { method: 'GET', path: '/api/data', status: 200, duration: 50 },
            { method: 'GET', path: '/api/data', status: 500, duration: 50 },
            { method: 'GET', path: '/api/data', status: 404, duration: 50 },
            { method: 'GET', path: '/api/data', status: 201, duration: 50 }
        ];
        const results = (0, analyzer_1.processLogs)(logs);
        (0, vitest_1.expect)(results[0].successRate).toBe(50);
    });
    (0, vitest_1.it)('should sort status codes by occurrence count (ascending)', () => {
        const logs = [
            { method: 'GET', path: '/test', status: 200, duration: 10 },
            { method: 'GET', path: '/test', status: 200, duration: 10 },
            { method: 'GET', path: '/test', status: 200, duration: 10 },
            { method: 'GET', path: '/test', status: 404, duration: 10 },
            { method: 'GET', path: '/test', status: 404, duration: 10 },
            { method: 'GET', path: '/test', status: 500, duration: 10 }
        ];
        const results = (0, analyzer_1.processLogs)(logs);
        const statusMap = results[0].statusCode;
        const keys = Array.from(statusMap.keys());
        (0, vitest_1.expect)(keys).toEqual([500, 404, 200]);
        (0, vitest_1.expect)(statusMap.get(500)).toBe(1);
        (0, vitest_1.expect)(statusMap.get(200)).toBe(3);
    });
    (0, vitest_1.it)('should calculate max, median, and p95 latency accurately', () => {
        const logs = Array.from({ length: 100 }, (_, i) => ({
            method: 'GET',
            path: '/stats',
            status: 200,
            duration: i + 1
        }));
        const results = (0, analyzer_1.processLogs)(logs);
        const latency = results[0].latency;
        (0, vitest_1.expect)(latency.max).toBe(100);
        (0, vitest_1.expect)(latency.median).toBe(50.5);
        (0, vitest_1.expect)(latency.p95).toBe(95);
    });
    (0, vitest_1.it)('should handle empty log arrays', () => {
        const results = (0, analyzer_1.processLogs)([]);
        (0, vitest_1.expect)(results).toEqual([]);
    });
});
//# sourceMappingURL=analyzer.test.js.map