// LIVE CHAT FUNCTIONALITY for Admin Dashboard
let currentChatId = null;
let chatPollInterval = null;

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

function displayConversations(conversations) {
    const container = document.getElementById('conversationsList');
    const badge = document.getElementById('totalChats');
    const menuBadge = document.getElementById('chatUnreadBadge');

    if (!container) return;

    if (conversations.length === 0) {
        container.innerHTML = `
            <div class="empty-conversations">
                <i class="fas fa-comments" style="font-size:3rem; color:#cbd5e1; margin-bottom:1rem;"></i>
                <p>No conversations yet</p>
            </div>
        `;
        if (badge) badge.textContent = '0';
        if (menuBadge) menuBadge.style.display = 'none';
        return;
    }

    if (badge) badge.textContent = conversations.length;

    // Calculate total unread
    const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
    if (menuBadge) {
        if (totalUnread > 0) {
            menuBadge.textContent = totalUnread;
            menuBadge.style.display = 'inline';
        } else {
            menuBadge.style.display = 'none';
        }
    }

    container.innerHTML = conversations.map(conv => {
        const time = new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const unreadBadge = conv.unread > 0 ? `<span class="unread-badge">${conv.unread}</span>` : '';
        const active = conv.id === currentChatId ? 'active' : '';

        return `
            <div class="conversation-item ${active}" onclick="openChat('${conv.id}')">
                <div class="conversation-header">
                    <span class="conversation-id">Customer ${conv.id.slice(-6)}${unreadBadge}</span>
                    <span class="conversation-time">${time}</span>
                </div>
                <div class="conversation-preview">${conv.lastMessage || 'No messages'}</div>
            </div>
        `;
    }).join('');
}

async function openChat(conversationId) {
    currentChatId = conversationId;

    // Update UI
    document.getElementById('chatWelcome').style.display = 'none';
    document.getElementById('chatActive').style.display = 'flex';
    document.getElementById('chatCustomerName').textContent = `Customer ${conversationId.slice(-6)}`;
    document.getElementById('chatCustomerId').textContent = conversationId;

    // Load messages
    try {
        const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
        if (!res.ok) return;

        const data = await res.json();
        displayChatMessages(data.messages || []);

        // Mark as read
        await markChatRead();
    } catch (e) {
        console.error('Failed to load chat messages', e);
    }
}

function displayChatMessages(messages) {
    const container = document.getElementById('chatMessagesPanel');
    if (!container) return;

    container.innerHTML = messages.map(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="admin-chat-message ${msg.sender}">
                <div class="admin-message-bubble">${escapeHtmlChat(msg.message)}</div>
                <div class="admin-message-time">${time}</div>
            </div>
        `;
    }).join('');

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function escapeHtmlChat(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
            body: JSON.stringify({
                conversationId: currentChatId,
                message,
                sender: 'admin'
            })
        });

        if (res.ok) {
            textarea.value = '';
            openChat(currentChatId); // Reload messages
        }
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

        loadChatInbox(); // Refresh list
    } catch (e) {
        console.error('Failed to mark as read', e);
    }
}
