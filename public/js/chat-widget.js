// Live Chat Widget - Redesigned with Animations
(function () {
    let conversationId = localStorage.getItem('chatConversationId') || generateId();
    let customerName = localStorage.getItem('chatCustomerName') || '';
    localStorage.setItem('chatConversationId', conversationId);

    let lastMessageCount = 0;
    let pollInterval = null;
    let typingTimeout = null;

    function generateId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function createChatWidget() {
        const widgetHTML = `
            <div id="chat-widget">
                <button id="chat-button" aria-label="Open chat">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 8H14M5 12H19M5 16H11" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </button>
                
                <div id="chat-popup">
                    <div class="chat-header">
                        <div class="chat-header-left">
                            <div class="chat-avatar" style="background: #004C99; color: white;">🎧</div>
                            <div>
                                <h3 style="margin:0; line-height:1.2;">3DAspire Support</h3>
                                <span style="font-size: 0.75rem; color: #10b981;">● Online</span>
                            </div>
                        </div>
                        <button class="chat-close" aria-label="Close chat" style="font-size: 24px;">&times;</button>
                    </div>
                    
                    <div id="nameInputScreen" class="name-input-screen">
                        <h2>Welcome! 👋</h2>
                        <p>Please enter your name to start chatting</p>
                        <input type="text" id="customerNameInput" placeholder="Your name..." maxlength="50">
                        <button id="startChatBtn" onclick="startChat()">Start Chat</button>
                    </div>
                    
                    <div id="chatMessagesContainer" style="display:none; flex:1; display:flex; flex-direction:column;">
                        <div class="chat-messages" id="chat-messages">
                            <div class="welcome-message">
                                Hi there 👋 If you need any assistance, I'm always here.
                            </div>
                        </div>
                        
                        <div id="typingIndicator" class="chat-messages" style="display:none; padding: 0 20px 10px 20px; background: #f9fafb; flex: none;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div class="typing-indicator" style="margin-bottom: 0;">
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                </div>
                                <span style="font-size: 0.75rem; color: #6b7280; font-style: italic;">3DAspire Support is typing...</span>
                            </div>
                        </div>
                        
                        <div class="chat-input-area">
                            <input type="text" class="chat-input" id="chat-input" placeholder="Type your message..." maxlength="500">
                            <button class="chat-send-btn" id="chat-send" aria-label="Send message">
                                <svg viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="chat-footer">
                            Powered by Your Company
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        attachEventListeners();

        if (customerName) {
            document.getElementById('nameInputScreen').style.display = 'none';
            document.getElementById('chatMessagesContainer').style.display = 'flex';
            loadMessages();
            startPolling();
        }
    }

    function attachEventListeners() {
        const button = document.getElementById('chat-button');
        const popup = document.getElementById('chat-popup');
        const close = document.querySelector('.chat-close');
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');
        const nameInput = document.getElementById('customerNameInput');

        button.addEventListener('click', () => {
            popup.classList.toggle('open');
            if (popup.classList.contains('open')) {
                if (window.innerWidth <= 480) {
                    document.body.style.overflow = 'hidden'; // Lock scroll on mobile
                }
                if (customerName) {
                    input.focus();
                    loadMessages();
                } else {
                    nameInput.focus();
                }
            } else {
                document.body.style.overflow = ''; // Unlock scroll
            }
        });

        close.addEventListener('click', () => {
            popup.classList.remove('open');
            document.body.style.overflow = ''; // Unlock scroll
        });

        sendBtn.addEventListener('click', sendMessage);

        input.addEventListener('input', () => {
            sendTypingStatus();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                startChat();
            }
        });
    }

    async function sendTypingStatus() {
        if (typingTimeout) return;

        typingTimeout = setTimeout(() => { typingTimeout = null; }, 3000);

        try {
            await fetch('/api/chat/typing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, sender: 'customer' })
            });
        } catch (e) { }
    }

    window.startChat = function () {
        const nameInput = document.getElementById('customerNameInput');
        const name = nameInput.value.trim();
        if (!name) { nameInput.style.borderColor = '#ef4444'; return; }
        customerName = name;
        localStorage.setItem('chatCustomerName', customerName);
        document.getElementById('nameInputScreen').style.display = 'none';
        document.getElementById('chatMessagesContainer').style.display = 'flex';
        document.getElementById('chat-input').focus();
        loadMessages();
        startPolling();
    };

    async function sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message || !customerName) return;
        const sendBtn = document.getElementById('chat-send');
        sendBtn.disabled = true;
        input.disabled = true;
        try {
            const res = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, message, sender: 'customer', customerName })
            });
            if (res.ok) { input.value = ''; loadMessages(); }
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
            displayMessages(data.messages || [], data.unread === 0);

            // Handle typing indicator
            const typingInd = document.getElementById('typingIndicator');
            if (data.isTyping && data.isTyping.admin) {
                typingInd.style.display = 'block';
                const container = document.getElementById('chat-messages');
                container.scrollTop = container.scrollHeight;
            } else {
                typingInd.style.display = 'none';
            }

            if (data.messages && data.messages.length > lastMessageCount) {
                lastMessageCount = data.messages.length;
                const popup = document.getElementById('chat-popup');
                const button = document.getElementById('chat-button');
                if (!popup.classList.contains('open')) button.classList.add('unread');
                else button.classList.remove('unread');
            }
        } catch (e) {
            console.error('Failed to load messages', e);
        }
    }

    function displayMessages(messages, isRead) {
        const container = document.getElementById('chat-messages');
        const welcome = container.querySelector('.welcome-message');
        container.innerHTML = '';
        if (messages.length === 0) container.appendChild(welcome);

        messages.forEach((msg, index) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${msg.sender}`;
            const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let readReceipt = '';
            if (msg.sender === 'customer' && index === messages.length - 1 && isRead) {
                readReceipt = `<div class="read-receipt"><i class="fas fa-check-double"></i> Read</div>`;
            }

            msgDiv.innerHTML = `
                <div class="message-bubble">${escapeHtml(msg.message)}</div>
                <div class="message-time">${time}</div>
                ${readReceipt}
            `;
            container.appendChild(msgDiv);
        });
        container.scrollTop = container.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function sendPresence() {
        try {
            await fetch('/api/chat/presence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId })
            });
        } catch (e) { }
    }

    function startPolling() {
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(loadMessages, 3000);

        // Start presence signaling
        sendPresence();
        setInterval(sendPresence, 20000); // Every 20s
    }

    function stopPolling() {
        if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createChatWidget);
    else createChatWidget();

    window.addEventListener('beforeunload', () => {
        stopPolling();
        // Try to signal leaving
        if (navigator.sendBeacon) {
            const data = JSON.stringify({ conversationId });
            navigator.sendBeacon('/api/chat/presence', data);
        }
    });
})();
