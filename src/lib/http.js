export function getRequestBaseUrl(req) {
    const forwardedProto = req.headers['x-forwarded-proto'];
    const forwardedHost = req.headers['x-forwarded-host'];
    const protocol = (forwardedProto ? String(forwardedProto).split(',')[0] : req.protocol) || 'http';
    const host = forwardedHost ? String(forwardedHost).split(',')[0] : req.get('host');
    return `${protocol}://${host}`;
}
