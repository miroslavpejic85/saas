export function formatZodError(error) {
    return error.issues
        .map((issue) => {
            const path = issue.path?.length ? issue.path.join('.') : 'body';
            return `${path}: ${issue.message}`;
        })
        .join('; ');
}

export function parseJsonBody(req, res, schema) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: formatZodError(parsed.error) });
        return null;
    }
    return parsed.data;
}
