import { NextResponse, type NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const map = new Map<string, string>([
        ['/index.html', '/'],
        ['/login.html', '/login'],
        ['/pricing.html', '/pricing'],
        ['/success.html', '/success'],
        ['/protected.html', '/protected'],
    ]);

    const to = map.get(pathname);
    if (!to) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = to;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/index.html', '/login.html', '/pricing.html', '/success.html', '/protected.html'],
};
