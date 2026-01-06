// LIVE CHAT FUNCTIONALITY for Admin Dashboard with Animations
let currentChatId = null;
let currentChatName = null;
let chatPollInterval = null;
let adminTypingTimeout = null;

async function loadChatInbox() {
    try {
        const res = await fetch(`${API_BASE}/chat/conversations`);
        if (!res.ok) return;

        const data = await res.json();
        displayConversations(data.conversations || []);

        // Start polling for new messages
        if (!chatPollInterval) {
            chatPollInterval = setInterval(loadChatInbox, 5000);
        }
    } catch (e) {
        console.error('Failed to load chat inbox', e);
    }
}

let lastOnlineStatus = {};

function displayConversations(conversations) {
    const container = document.getElementById('conversationsList');
    const badge = document.getElementById('totalChats');
    const menuBadge = document.getElementById('chatUnreadBadge');

    if (!container) return;

    if (conversations.length === 0) {
        container.innerHTML = `<div class="empty-conversations"><p>No conversations yet</p></div>`;
        if (badge) badge.textContent = '0';
        if (menuBadge) menuBadge.style.display = 'none';
        return;
    }

    if (badge) badge.textContent = conversations.length;
    const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
    if (menuBadge) {
        if (totalUnread > 0) { menuBadge.textContent = totalUnread; menuBadge.style.display = 'inline'; }
        else { menuBadge.style.display = 'none'; }
    }

    container.innerHTML = conversations.map(conv => {
        const time = new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const unreadBadge = conv.unread > 0 ? `<span class="unread-badge">${conv.unread}</span>` : '';
        const active = conv.id === currentChatId ? 'active' : '';
        const displayName = conv.customerName || `Customer ${conv.id.slice(-6)}`;
        const onlineDot = conv.isOnline ? '<span class="online-dot-small"></span>' : '';

        return `
            <div class="conversation-item ${active}" onclick="openChat('${conv.id}', '${escapeHtmlAttr(displayName)}')">
                <div class="conversation-header">
                    <span class="conversation-id">${onlineDot}${escapeHtml(displayName)}${unreadBadge}</span>
                    <span class="conversation-time">${time}</span>
                </div>
                <div class="conversation-preview">${conv.lastMessage || 'No messages'}</div>
            </div>
        `;
    }).join('');
}

async function openChat(conversationId, customerName) {
    currentChatId = conversationId;
    currentChatName = customerName;

    document.getElementById('chatWelcome').style.display = 'none';
    document.getElementById('chatActive').style.display = 'flex';
    document.getElementById('chatCustomerName').textContent = customerName || `Customer ${conversationId.slice(-6)}`;
    document.getElementById('chatCustomerId').textContent = conversationId;

    // Handle mobile view
    if (window.innerWidth <= 1024) {
        document.querySelector('.chat-inbox-container').classList.add('viewing-chat');
    }

    // Setup typing listener
    const replyInput = document.getElementById('chatReplyInput');
    if (replyInput) replyInput.oninput = () => sendAdminTypingStatus();

    loadChatMessages();
}

function closeChatMobile() {
    document.querySelector('.chat-inbox-container').classList.remove('viewing-chat');
}

async function sendAdminTypingStatus() {
    if (adminTypingTimeout || !currentChatId) return;
    adminTypingTimeout = setTimeout(() => { adminTypingTimeout = null; }, 3000);
    try {
        await fetch('/api/chat/typing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId: currentChatId, sender: 'admin' })
        });
    } catch (e) { }
}

async function loadChatMessages() {
    if (!currentChatId) return;
    try {
        const res = await fetch(`/api/chat/messages?conversationId=${currentChatId}`);
        if (!res.ok) return;
        const data = await res.json();

        // Check if online status changed
        const isOnline = data.isOnline; // We'll need to update the messages API too
        if (lastOnlineStatus[currentChatId] === true && isOnline === false) {
            appendSystemMessage('User left the website');
        }
        lastOnlineStatus[currentChatId] = isOnline;

        displayChatMessages(data.messages || [], data.unread === 0);

        // Handle customer typing indicator
        const messagesPanel = document.getElementById('chatMessagesPanel');
        const existingTyping = document.getElementById('adminTypingIndicator');
        if (data.isTyping && data.isTyping.customer) {
            if (!existingTyping) {
                const typingDiv = document.createElement('div');
                typingDiv.id = 'adminTypingIndicator';
                typingDiv.className = 'admin-chat-message customer';
                typingDiv.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div class="typing-indicator" style="background:#f3f4f6; padding: 8px 12px; border-radius: 12px; margin: 0;">
                            <div class="typing-dot" style="background:#9ca3af;"></div>
                            <div class="typing-dot" style="background:#9ca3af;"></div>
                            <div class="typing-dot" style="background:#9ca3af;"></div>
                        </div>
                        <span style="font-size: 0.75rem; color: #6b7280; font-style: italic;">Customer is typing...</span>
                    </div>
                `;
                messagesPanel.appendChild(typingDiv);
                messagesPanel.scrollTop = messagesPanel.scrollHeight;
            }
        } else if (existingTyping) {
            existingTyping.remove();
        }

        if (data.unread > 0) await markChatRead();
    } catch (e) {
        console.error('Failed to load chat messages', e);
    }
}

function appendSystemMessage(text) {
    const container = document.getElementById('chatMessagesPanel');
    const div = document.createElement('div');
    div.className = 'system-message';
    div.style.cssText = 'text-align: center; margin: 1rem 0; font-size: 0.75rem; color: #9ca3af; font-style: italic;';
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function displayChatMessages(messages, isRead) {
    const container = document.getElementById('chatMessagesPanel');
    if (!container) return;

    container.innerHTML = messages.map((msg, index) => {
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let readReceipt = '';
        if (msg.sender === 'admin' && index === messages.length - 1 && isRead) {
            readReceipt = `<div class="admin-message-time" style="text-align:right;"><i class="fas fa-check-double" style="color:#10b981;"></i> Read</div>`;
        }

        return `
            <div class="admin-chat-message ${msg.sender}">
                <div class="admin-message-bubble">${escapeHtml(msg.message)}</div>
                <div class="admin-message-time">${time}</div>
                ${readReceipt}
            </div>
        `;
    }).join('');

    container.scrollTop = container.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeHtmlAttr(text) {
    return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function sendAdminReply() {
    if (!currentChatId) return;
    const textarea = document.getElementById('chatReplyInput');
    const btn = document.getElementById('chatReplyBtn');
    const message = textarea.value.trim();
    if (!message) return;
    btn.disabled = true;
    textarea.disabled = true;
    try {
        const res = await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId: currentChatId, message, sender: 'admin' })
        });
        if (res.ok) { textarea.value = ''; loadChatMessages(); }
    } catch (e) {
        console.error('Failed to send reply', e);
    } finally {
        btn.disabled = false;
        textarea.disabled = false;
        textarea.focus();
    }
}

async function markChatRead() {
    if (!currentChatId) return;
    try {
        await fetch(`${API_BASE}/chat/mark-read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId: currentChatId })
        });
        loadChatInbox();
    } catch (e) {
        console.error('Failed to mark as read', e);
    }
}

// Update polling to include messages if a chat is open
setInterval(() => {
    if (currentChatId && document.getElementById('chat').classList.contains('active')) {
        loadChatMessages();
    }
}, 3000);
