import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { parseLogs } from '../parser'; 
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Log Parser & Validator', () => {
    let tempDir: string;
    let tempFilePath: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'log-test-'));
        tempFilePath = path.join(tempDir, 'test-logs.jsonl');
    });

    afterEach(() => {
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        if (fs.existsSync(tempDir)) {
            fs.rmdirSync(tempDir);
        }
    });

    it('should successfully parse valid jsonl log lines', () => {
        const rawData = 
            '{"timestamp":"2026-09-23T10:00:00Z","method":"GET","path":"/health","status":200,"duration":12}\n' +
            '{"timestamp":"2026-09-23T10:01:00Z","method":"POST","path":"/api/users","status":201,"duration":45}';
        
        fs.writeFileSync(tempFilePath, rawData, 'utf-8');

        const logs = parseLogs(tempFilePath);

        expect(logs).toHaveLength(2);
        expect(logs[0]).toEqual({
            timestamp: '2026-09-23T10:00:00Z',
            method: 'GET',
            path: '/health',
            status: 200,
            duration: 12
        });
        expect(logs[1].method).toBe('POST');
    });

    it('should skip malformed JSON lines and continue parsing', () => {
        const rawData = 
            '{"timestamp":"2026-09-23T10:00:00Z","method":"GET","path":"/health","status":200,"duration":12}\n' +
            'INVALID_JSON_LINE_CORRUPTED\n' +
            '{"timestamp":"2026-09-23T10:02:00Z","method":"DELETE","path":"/item/1","status":204,"duration":8}';

        fs.writeFileSync(tempFilePath, rawData, 'utf-8');

        const logs = parseLogs(tempFilePath);

        expect(logs).toHaveLength(2);
        expect(logs[0].path).toBe('/health');
        expect(logs[1].path).toBe('/item/1');
    });

    it('should skip lines that do not match the valid ApiLog schema (isValidApiLog check)', () => {
        const rawData = 
            '{"timestamp":"2026-09-23T10:00:00Z","method":"GET","path":"/health","status":200}\n' +
            '{"timestamp":"2026-09-23T10:01:00Z","method":"GET","path":"/metrics","status":200,"duration":5}';

        fs.writeFileSync(tempFilePath, rawData, 'utf-8');

        const logs = parseLogs(tempFilePath);

        expect(logs).toHaveLength(1);
        expect(logs[0].path).toBe('/metrics');
    });

    it('should handle empty files gracefully', () => {
        fs.writeFileSync(tempFilePath, '', 'utf-8');

        const logs = parseLogs(tempFilePath);
        expect(logs).toEqual([]);
    });
});