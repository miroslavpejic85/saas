export function cleanOptionalEnvString(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string') return String(value);
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const unquoted = trimmed.replace(/^['"](.*)['"]$/, '$1').trim();
    return unquoted || undefined;
}

export function parseOptionalBool(value: unknown): boolean | undefined {
    const raw = cleanOptionalEnvString(value);
    if (!raw) return undefined;
    const normalized = raw.toLowerCase();
    if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
    return undefined;
}

export function parseOptionalCsv(value: unknown): string[] | undefined {
    const raw = cleanOptionalEnvString(value);
    if (!raw) return undefined;
    const list = raw
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    return list.length ? list : undefined;
}
