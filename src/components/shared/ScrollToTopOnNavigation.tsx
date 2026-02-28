import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTopOnNavigation() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Force manual scroll restoration to prevent browser interference
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const forceScroll = () => {
            // Target all potential scroll containers
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });

            // Legacy fallbacks
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        // Execute immediately
        forceScroll();

        // Repeat shortly after to handle dynamic content height changes
        const timeoutId = setTimeout(forceScroll, 50);
        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
}
