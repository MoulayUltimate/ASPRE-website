'use client';
import { useState, useEffect, useRef } from 'react';

export default function LiveChatPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [replyText, setReplyText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Poll conversations list
    useEffect(() => {
        fetchConversations();
        const int = setInterval(fetchConversations, 5000);
        return () => clearInterval(int);
    }, []);

    // Poll active chat messages
    useEffect(() => {
        if (!activeChat) return;
        fetchActiveChat();
        const int = setInterval(fetchActiveChat, 2000);
        return () => clearInterval(int);
    }, [activeChat?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const res = await fetch(`${apiUrl}/chat/conversations`);
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (e) {
            console.error('Failed to fetch conversations', e);
        }
    };

    const fetchActiveChat = async () => {
        if (!activeChat) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            // Fetching with role=admin automatically clears unreadAdmin server-side
            const res = await fetch(`${apiUrl}/chat/${activeChat.id}?role=admin`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
                // Update local conversations list selectively to reflect read status instantly
                setConversations(prev => prev.map(c =>
                    c.id === activeChat.id ? { ...c, unread: 0 } : c
                ));
            }
        } catch (e) {
            console.error('Failed to fetch active chat', e);
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !activeChat) return;
        const msg = replyText;
        setReplyText('');

        // Optimistic UI
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'admin',
            text: msg,
            timestamp: Date.now()
        }]);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            await fetch(`${apiUrl}/chat/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId: activeChat.id, message: msg, sender: 'admin' })
            });
            fetchConversations();
        } catch (e) {
            console.error('Fail to send', e);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-inter)' }}>
            <h1 style={{ fontSize: '1.875rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Live Chat Inbox</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1.5rem', height: '70vh' }}>
                {/* Conversations List */}
                <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Conversations</h3>
                        <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            {conversations.length}
                        </span>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {conversations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                                <i className="fas fa-comments" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conv, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveChat(conv)}
                                    style={{
                                        padding: '1.25rem', borderBottom: '1px solid #e5e7eb', cursor: 'pointer',
                                        background: activeChat?.id === conv.id ? '#f3f4f6' : 'white',
                                        transition: 'background 0.2s', position: 'relative'
                                    }}
                                >
                                    <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {conv.email}
                                        {conv.unread > 0 && (
                                            <span style={{ background: '#ef4444', color: 'white', fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>
                                                {conv.unread} newly unread
                                            </span>
                                        )}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {conv.lastMessage}
                                    </p>
                                    <small style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
                                        {new Date(conv.lastMessageTime).toLocaleString()}
                                    </small>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Panel */}
                <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {!activeChat ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#9ca3af' }}>
                            <div>
                                <i className="fas fa-comment-dots" style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#e5e7eb' }}></i>
                                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#374151' }}>Select a conversation</h2>
                                <p>Choose a conversation from the left to start chatting</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Chat with <span style={{ color: '#4f46e5' }}>{activeChat.email}</span></h3>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f3f4f6' }}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} style={{
                                        alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                        background: msg.sender === 'admin' ? '#4f46e5' : 'white',
                                        color: msg.sender === 'admin' ? 'white' : '#1f2937',
                                        padding: '0.75rem 1.25rem', borderRadius: '1rem',
                                        borderBottomRightRadius: msg.sender === 'admin' ? '0.25rem' : '1rem',
                                        borderBottomLeftRadius: msg.sender === 'customer' ? '0.25rem' : '1rem',
                                        maxWidth: '75%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{ marginBottom: '0.25rem', wordBreak: 'break-word' }}>{msg.text}</div>
                                        <div style={{ fontSize: '0.7rem', color: msg.sender === 'admin' ? '#c7d2fe' : '#9ca3af', textAlign: 'right' }}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb', background: 'white' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <textarea
                                        placeholder="Type your reply here..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendReply();
                                            }
                                        }}
                                        rows={2}
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', resize: 'none', fontFamily: 'inherit' }}
                                    />
                                    <button
                                        onClick={handleSendReply}
                                        style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <i className="fas fa-paper-plane"></i> Send
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
