'use client';

export type RouterLike = {
    replace: (href: string) => void;
};

export function isInternalHref(href: string): boolean {
    return href.startsWith('/');
}

export function replaceHref(router: RouterLike, href: string): void {
    if (isInternalHref(href)) {
        router.replace(href);
        return;
    }

    window.location.href = href;
}
