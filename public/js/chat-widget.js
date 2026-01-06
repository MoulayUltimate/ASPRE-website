// Live Chat Widget
(function () {
    let conversationId = localStorage.getItem('chatConversationId') || generateId();
    localStorage.setItem('chatConversationId', conversationId);

    let lastMessageCount = 0;
    let pollInterval = null;

    function generateId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function createChatWidget() {
        const widgetHTML = `
            <div id="chat-widget">
                <button id="chat-button" aria-label="Open chat">
                    <svg viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    </svg>
                </button>
                
                <div id="chat-popup">
                    <div class="chat-header">
                        <h3>Send us a message</h3>
                        <button class="chat-close" aria-label="Close chat">&times;</button>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <div class="welcome-message">
                            <span class="emoji">👋</span>
                            <strong>Hi there!</strong><br>
                            Have any questions? Ask away!
                        </div>
                    </div>
                    
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" id="chat-input" placeholder="Type here..." maxlength="500">
                        <button class="chat-send-btn" id="chat-send" aria-label="Send message">
                            <svg viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        attachEventListeners();
        loadMessages();
        startPolling();
    }

    function attachEventListeners() {
        const button = document.getElementById('chat-button');
        const popup = document.getElementById('chat-popup');
        const close = document.querySelector('.chat-close');
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');

        button.addEventListener('click', () => {
            popup.classList.toggle('open');
            if (popup.classList.contains('open')) {
                input.focus();
                loadMessages();
            }
        });

        close.addEventListener('click', () => {
            popup.classList.remove('open');
        });

        sendBtn.addEventListener('click', sendMessage);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    async function sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        const sendBtn = document.getElementById('chat-send');
        sendBtn.disabled = true;
        input.disabled = true;

        try {
            const res = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId,
                    message,
                    sender: 'customer'
                })
            });

            if (res.ok) {
                input.value = '';
                loadMessages();
            }
        } catch (e) {
            console.error('Failed to send message', e);
        } finally {
            sendBtn.disabled = false;
            input.disabled = false;
            input.focus();
        }
    }

    async function loadMessages() {
        try {
            const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
            if (!res.ok) return;

            const data = await res.json();
            displayMessages(data.messages || []);

            // Check for new messages
            if (data.messages && data.messages.length > lastMessageCount) {
                lastMessageCount = data.messages.length;

                // Show notification badge if chat is closed
                const popup = document.getElementById('chat-popup');
                const button = document.getElementById('chat-button');
                if (!popup.classList.contains('open')) {
                    button.classList.add('unread');
                } else {
                    button.classList.remove('unread');
                }
            }
        } catch (e) {
            console.error('Failed to load messages', e);
        }
    }

    function displayMessages(messages) {
        const container = document.getElementById('chat-messages');
        const welcome = container.querySelector('.welcome-message');

        // Clear all except welcome message
        container.innerHTML = '';
        if (messages.length === 0) {
            container.appendChild(welcome);
        }

        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${msg.sender}`;

            const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            msgDiv.innerHTML = `
                <div class="message-bubble">${escapeHtml(msg.message)}</div>
                <div class="message-time">${time}</div>
            `;

            container.appendChild(msgDiv);
        });

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function startPolling() {
        // Poll every 3 seconds for new messages
        pollInterval = setInterval(loadMessages, 3000);
    }

    function stopPolling() {
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createChatWidget);
    } else {
        createChatWidget();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', stopPolling);
})();
