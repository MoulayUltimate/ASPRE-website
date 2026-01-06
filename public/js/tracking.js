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

    // Expose globally
    window.sendEvent = sendEvent;

    // 1. Track Page View
    sendEvent('pageview');

    // 2. Heartbeat (every 30s) for Real-time
    setInterval(() => {
        sendEvent('heartbeat');
    }, 30000);
    sendEvent('heartbeat'); // Initial

    // 3. Track Clicks with Full Details
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        const btn = e.target.closest('button');

        if (link) {
            sendEvent('click', {
                clickType: 'link',
                href: link.href,
                text: (link.innerText || link.textContent || 'Image/Icon').trim().slice(0, 100),
                target: link.target || '_self'
            });
        } else if (btn) {
            sendEvent('click', {
                clickType: 'button',
                text: (btn.innerText || btn.textContent || 'Button').trim().slice(0, 100),
                id: btn.id || null
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
