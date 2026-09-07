import { describe, it, expect } from 'vitest';
import { processLogs } from '../src/analyzer';
import { ApiLog } from '../src/types';

describe('processLogs', () => {
    it('should aggregate identical normalized paths', () => {
        const logs: ApiLog[] = [
            { method: 'GET', path: '/books/1', status: 200, duration: 100 },
            { method: 'GET', path: '/books/2', status: 200, duration: 150 },
            { method: 'POST', path: '/books', status: 201, duration: 200 }
        ];

        const results = processLogs(logs);

        expect(results).toHaveLength(2);
        
        const getBooks = results.find(r => r.method === 'GET');
        expect(getBooks?.route).toBe('/books/:id');
        expect(getBooks?.requestCount).toBe(2);
    });

    it('should calculate success rate correctly', () => {
        const logs: ApiLog[] = [
            { method: 'GET', path: '/api/data', status: 200, duration: 50 },
            { method: 'GET', path: '/api/data', status: 500, duration: 50 },
            { method: 'GET', path: '/api/data', status: 404, duration: 50 },
            { method: 'GET', path: '/api/data', status: 201, duration: 50 }
        ];

        const results = processLogs(logs);
        
        expect(results[0].successRate).toBe(50);
    });

    it('should sort status codes by occurrence count (ascending)', () => {
        const logs: ApiLog[] = [
            { method: 'GET', path: '/test', status: 200, duration: 10 },
            { method: 'GET', path: '/test', status: 200, duration: 10 },
            { method: 'GET', path: '/test', status: 200, duration: 10 },
            { method: 'GET', path: '/test', status: 404, duration: 10 },
            { method: 'GET', path: '/test', status: 404, duration: 10 },
            { method: 'GET', path: '/test', status: 500, duration: 10 }
        ];

        const results = processLogs(logs);
        const statusMap = results[0].statusCode;

        const keys = Array.from(statusMap.keys());
        expect(keys).toEqual([500, 404, 200]);
        expect(statusMap.get(500)).toBe(1);
        expect(statusMap.get(200)).toBe(3);
    });

    it('should calculate max, median, and p95 latency accurately', () => {
        const logs: ApiLog[] = Array.from({ length: 100 }, (_, i) => ({
            method: 'GET',
            path: '/stats',
            status: 200,
            duration: i + 1 
        }));

        const results = processLogs(logs);
        const latency = results[0].latency;

        expect(latency.max).toBe(100);
        
        expect(latency.median).toBe(50.5); 
        
        expect(latency.p95).toBe(95); 
    });

    it('should handle empty log arrays', () => {
        const results = processLogs([]);
        expect(results).toEqual([]);
    });
});