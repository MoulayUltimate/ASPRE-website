// Lightweight Tracking Script
(function () {
    const TRACK_API = '/api/track';
    const SESSION_ID = crypto.randomUUID();

    function sendEvent(type, data = {}) {
        fetch(TRACK_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                sessionId: SESSION_ID,
                url: window.location.pathname,
                ...data
            })
        }).catch(() => { }); // Ignore errors to not block UI
    }

    // 1. Track Page View
    sendEvent('pageview');

    // 2. Heartbeat (every 30s) for Real-time
    setInterval(() => {
        sendEvent('heartbeat');
    }, 30000);
    sendEvent('heartbeat'); // Initial

    // 3. Track Clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        const btn = e.target.closest('button');

        if (link || btn) {
            sendEvent('click', {
                target: (link?.href || btn?.innerText || 'unknown').slice(0, 100),
                tag: link ? 'a' : 'button'
            });
        }
    });

    // 4. Track Errors
    window.addEventListener('error', (e) => {
        sendEvent('error', {
            message: e.message,
            source: e.filename,
            lineno: e.lineno
        });
    });

})();
