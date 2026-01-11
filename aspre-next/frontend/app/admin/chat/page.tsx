'use client';

export default function LiveChatPage() {
    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Live Chat</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1.5rem', height: '70vh' }}>
                {/* Conversations List */}
                <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <h3 style={{ margin: 0 }}>Conversations</h3>
                    </div>
                    <div style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                        <div style={{ textAlign: 'center' }}>
                            <i className="fas fa-comments" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                            <p>No conversations yet</p>
                        </div>
                    </div>
                </div>

                {/* Chat Panel */}
                <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                        <i className="fas fa-comment-dots" style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}></i>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#374151' }}>Select a conversation</h2>
                        <p>Choose a conversation from the left to start chatting</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
