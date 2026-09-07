"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const parser_1 = require("../src/parser");
const fs_1 = __importDefault(require("fs"));
(0, vitest_1.describe)('parseLogs', () => {
    let consoleWarnSpy;
    let fsReadSpy;
    (0, vitest_1.beforeEach)(() => {
        consoleWarnSpy = vitest_1.vi.spyOn(console, 'warn').mockImplementation(() => { });
        fsReadSpy = vitest_1.vi.spyOn(fs_1.default, 'readFileSync');
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('should parse valid JSONL correctly', () => {
        const validData = [
            `{"method":"GET","path":"/books","status":200,"duration":120}`,
            `{"method":"POST","path":"/books","status":201,"duration":300}`
        ].join('\n');
        fsReadSpy.mockReturnValue(validData);
        const logs = (0, parser_1.parseLogs)('dummy.log');
        (0, vitest_1.expect)(logs).toHaveLength(2);
        (0, vitest_1.expect)(logs[0].path).toBe('/books');
        (0, vitest_1.expect)(consoleWarnSpy).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should skip malformed JSON and trigger a warning', () => {
        const mixedData = [
            `{"method":"GET","path":"/books","status":200,"duration":120}`,
            `{ bad json ]`,
            `{"method":"DELETE","path":"/books/1","status":204,"duration":150}`
        ].join('\n');
        fsReadSpy.mockReturnValue(mixedData);
        const logs = (0, parser_1.parseLogs)('dummy.log');
        (0, vitest_1.expect)(logs).toHaveLength(2);
        (0, vitest_1.expect)(consoleWarnSpy).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(consoleWarnSpy).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Skipped 1 invalid log'));
    });
    (0, vitest_1.it)('should skip valid JSON that fails schema validation', () => {
        const invalidSchemaData = [
            `{"method":"GET","path":"/books","status":200,"duration":120}`, // Valid
            `{"method":"GET","path": 123,"status":200,"duration":120}`, // Invalid path type
            `{"path":"/books","status":200,"duration":120}` // Missing method
        ].join('\n');
        fsReadSpy.mockReturnValue(invalidSchemaData);
        const logs = (0, parser_1.parseLogs)('dummy.log');
        (0, vitest_1.expect)(logs).toHaveLength(1);
        (0, vitest_1.expect)(logs[0].method).toBe('GET');
        (0, vitest_1.expect)(consoleWarnSpy).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(consoleWarnSpy).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Skipped 2 invalid log'));
    });
    (0, vitest_1.it)('should ignore empty lines', () => {
        const dataWithEmptyLines = `\n\n{"method":"GET","path":"/test","status":200,"duration":50}\n\n`;
        fsReadSpy.mockReturnValue(dataWithEmptyLines);
        const logs = (0, parser_1.parseLogs)('dummy.log');
        (0, vitest_1.expect)(logs).toHaveLength(1);
        (0, vitest_1.expect)(consoleWarnSpy).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=parser.test.js.map