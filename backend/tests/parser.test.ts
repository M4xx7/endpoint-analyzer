import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseLogs } from '../src/parser'; 
import fs from 'fs';

describe('parseLogs', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
    let fsReadSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        fsReadSpy = vi.spyOn(fs, 'readFileSync');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should parse valid JSONL correctly', () => {
        const validData = [
            `{"method":"GET","path":"/books","status":200,"duration":120}`,
            `{"method":"POST","path":"/books","status":201,"duration":300}`
        ].join('\n');

        fsReadSpy.mockReturnValue(validData);

        const logs = parseLogs('dummy.log');

        expect(logs).toHaveLength(2);
        expect(logs[0].path).toBe('/books');
        expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should skip malformed JSON and trigger a warning', () => {
        const mixedData = [
            `{"method":"GET","path":"/books","status":200,"duration":120}`,
            `{ bad json ]`,
            `{"method":"DELETE","path":"/books/1","status":204,"duration":150}`
        ].join('\n');

        fsReadSpy.mockReturnValue(mixedData);

        const logs = parseLogs('dummy.log');

        expect(logs).toHaveLength(2);
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Skipped 1 invalid log'));
    });

    it('should skip valid JSON that fails schema validation', () => {
        const invalidSchemaData = [
            `{"method":"GET","path":"/books","status":200,"duration":120}`, // Valid
            `{"method":"GET","path": 123,"status":200,"duration":120}`,    // Invalid path type
            `{"path":"/books","status":200,"duration":120}`                 // Missing method
        ].join('\n');

        fsReadSpy.mockReturnValue(invalidSchemaData);

        const logs = parseLogs('dummy.log');

        expect(logs).toHaveLength(1);
        expect(logs[0].method).toBe('GET');
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Skipped 2 invalid log'));
    });
    
    it('should ignore empty lines', () => {
        const dataWithEmptyLines = `\n\n{"method":"GET","path":"/test","status":200,"duration":50}\n\n`;
        fsReadSpy.mockReturnValue(dataWithEmptyLines);

        const logs = parseLogs('dummy.log');

        expect(logs).toHaveLength(1);
        expect(consoleWarnSpy).not.toHaveBeenCalled(); 
    });
});