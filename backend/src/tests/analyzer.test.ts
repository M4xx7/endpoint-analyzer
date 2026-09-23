import { describe, it, expect } from 'vitest';
import { processLogs } from '../analyzer';
import { ApiLog } from '../types';

describe('Endpoint Analyzer Core Logic', () => {

    describe('normalizePath', () => {
        it('should replace numeric IDs with ":id placeholder', () => {
            const logs: ApiLog[] = [
                { timestamp: '2026-09-23T10:00:00Z', method: 'GET', path: '/api/users/42/posts/123', status: 200, duration: 15 }
            ];
            const result = processLogs(logs);
            expect(result[0].route).toBe('/api/users/:id/posts/:id');
        });

        it('should leave paths without numbers unchanged', () => {
            const logs: ApiLog[] = [
                { timestamp: '2026-09-23T10:00:00Z', method: 'GET', path: '/health', status: 200, duration: 5 }
            ];
            const result = processLogs(logs);
            expect(result[0].route).toBe('/health');
        });
    });

    describe('processLogs', () => {
        it('should correctly group requests by method and normalized path', () => {
            const logs: ApiLog[] = [
                { timestamp: '2026-09-23T10:00:00Z', method: 'GET', path: '/items/1', status: 200, duration: 10 },
                { timestamp: '2026-09-23T10:01:00Z', method: 'GET', path: '/items/99', status: 500, duration: 45 },
                { timestamp: '2026-09-23T10:02:00Z', method: 'POST', path: '/items', status: 201, duration: 30 }
            ];

            const results = processLogs(logs);

            expect(results).toHaveLength(2);

            const getEndpoint = results.find(r => r.method === 'GET' && r.route === '/items/:id');
            expect(getEndpoint).toBeDefined();
            expect(getEndpoint?.requests).toHaveLength(2);
            expect(getEndpoint?.requests[0].statusCode).toBe(200);
            expect(getEndpoint?.requests[1].statusCode).toBe(500);

            const postEndpoint = results.find(r => r.method === 'POST' && r.route === '/items');
            expect(postEndpoint).toBeDefined();
            expect(postEndpoint?.requests).toHaveLength(1);
            expect(postEndpoint?.requests[0].duration).toBe(30);
        });

        it('should handle an empty log array gracefully', () => {
            const results = processLogs([]);
            expect(results).toEqual([]);
        });
    });

});