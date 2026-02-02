'use client';

import { useEffect, useRef, type DependencyList } from 'react';

export function useAsyncEffect(effect: (signal: AbortSignal) => Promise<void> | void, deps: DependencyList): void {
    const effectRef = useRef(effect);

    useEffect(() => {
        effectRef.current = effect;
    }, [effect]);

    useEffect(() => {
        const controller = new AbortController();
        void effectRef.current(controller.signal);
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);
}
