'use client';
import { useState, useEffect, useRef } from 'react';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize from local storage
    useEffect(() => {
        const storedConvId = localStorage.getItem('aspre_chat_conv_id');
        const storedEmail = localStorage.getItem('aspre_chat_email');
        if (storedConvId && storedEmail) {
            setConversationId(storedConvId);
            setEmail(storedEmail);
        }
    }, []);

    // Polling for messages
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (conversationId && isOpen) {
            fetchMessages();
            interval = setInterval(fetchMessages, 3000);
        } else if (conversationId && !isOpen) {
            // Poll slower when closed just for unread counts
            interval = setInterval(fetchMessages, 10000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [conversationId, isOpen]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const fetchMessages = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const res = await fetch(`${apiUrl}/chat/${conversationId}?role=customer`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
                if (!isOpen) {
                    setUnread(data.unreadCustomer || 0);
                } else {
                    setUnread(0);
                }
            }
        } catch (e) {
            console.error('Chat fetch error', e);
        }
    };

    const handleStartChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !newMessage) return;
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const res = await fetch(`${apiUrl}/chat/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, initialMessage: newMessage })
            });
            if (res.ok) {
                const data = await res.json();
                setConversationId(data.conversationId);
                localStorage.setItem('aspre_chat_conv_id', data.conversationId);
                localStorage.setItem('aspre_chat_email', email);
                setNewMessage('');
                fetchMessages();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId) return;

        const optimisticMessage = {
            id: Date.now().toString(),
            sender: 'customer',
            text: newMessage,
            timestamp: Date.now() // fix missing property
        };
        setMessages((prev) => [...prev, optimisticMessage]);
        const messageToSend = newMessage;
        setNewMessage('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            await fetch(`${apiUrl}/chat/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, message: messageToSend, sender: 'customer' })
            });
        } catch (err) {
            console.error('Send error', err);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, fontFamily: 'var(--font-inter), sans-serif' }}>
            {/* Chat Popup */}
            {isOpen && (
                <div style={{
                    position: 'absolute', bottom: '5rem', right: 0,
                    width: '350px', height: '500px',
                    background: 'white', borderRadius: '1rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Live Chat</h3>
                            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>We typically reply in a few minutes</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.25rem' }}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {!conversationId ? (
                        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <i className="fas fa-headset" style={{ fontSize: '3rem', color: '#a855f7', marginBottom: '1rem' }}></i>
                                <h4 style={{ margin: 0, color: '#1f2937' }}>Welcome to Aspire Support!</h4>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>Please enter your email to start a conversation.</p>
                            </div>
                            <form onSubmit={handleStartChat} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                                />
                                <textarea
                                    placeholder="How can we help you?"
                                    required
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    rows={3}
                                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', resize: 'none' }}
                                />
                                <button type="submit" disabled={loading} style={{ background: '#7e22ce', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                                    {loading ? 'Starting...' : 'Start Chat'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} style={{
                                        alignSelf: msg.sender === 'customer' ? 'flex-end' : 'flex-start',
                                        background: msg.sender === 'customer' ? '#7e22ce' : '#e5e7eb',
                                        color: msg.sender === 'customer' ? 'white' : '#1f2937',
                                        padding: '0.5rem 1rem', borderRadius: '1rem',
                                        borderBottomRightRadius: msg.sender === 'customer' ? '0.25rem' : '1rem',
                                        borderBottomLeftRadius: msg.sender === 'admin' ? '0.25rem' : '1rem',
                                        maxWidth: '85%', fontSize: '0.875rem', wordBreak: 'break-word'
                                    }}>
                                        {msg.text}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} style={{ padding: '1rem', background: 'white', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '9999px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }}
                                />
                                <button type="submit" style={{ background: '#7e22ce', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => { setIsOpen(!isOpen); setUnread(0); }}
                style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                    color: 'white', border: 'none',
                    width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                    boxShadow: '0 4px 15px rgba(126, 34, 206, 0.4)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', position: 'relative', transition: 'transform 0.2s'
                }}
            >
                <i className={isOpen ? 'fas fa-chevron-down' : 'fas fa-comments'}></i>
                {!isOpen && unread > 0 && (
                    <span style={{
                        position: 'absolute', top: 0, right: 0, background: '#ef4444', color: 'white',
                        fontSize: '0.75rem', width: '1.25rem', height: '1.25rem', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                    }}>
                        {unread}
                    </span>
                )}
            </button>
        </div>
    );
}
