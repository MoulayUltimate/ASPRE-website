'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Only track on client side and not on admin pages
        if (typeof window === 'undefined' || pathname?.startsWith('/admin')) return;

        const trackPageview = async () => {
            try {
                // Get or create session ID
                let sessionId = localStorage.getItem('aspre_session_id');
                if (!sessionId) {
                    sessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
                    localStorage.setItem('aspre_session_id', sessionId);
                }

                // Simple country detection (fallback to US if not available from a better source)
                // In a real production app, the backend can get this from Cloudflare headers
                const country = 'US';

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                await fetch(`${apiUrl}/analytics/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'pageview',
                        url: window.location.pathname,
                        sessionId,
                        country
                    })
                });
            } catch (e) {
                // Silently fail to not interrupt user experience
            }
        };

        trackPageview();

        // Optional: Track clicks on important buttons
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
                const text = target.innerText || target.getAttribute('aria-label') || 'Clicked element';
                const sessionId = localStorage.getItem('aspre_session_id');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

                fetch(`${apiUrl}/analytics/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'click',
                        url: window.location.pathname,
                        text: text.substring(0, 50),
                        sessionId
                    })
                }).catch(() => { });
            }
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [pathname]);

    return null; // This component doesn't render anything
}
