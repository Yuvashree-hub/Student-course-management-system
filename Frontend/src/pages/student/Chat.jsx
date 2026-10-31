import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import { fetchContacts, fetchConversation, setActiveChat } from '../../store/chatSlice';
import { getSocket } from '../../services/socket';
import { formatTime } from '../../utils/format';

const EMPTY = [];

// Real-time one-to-one chat (works for students and admins).
export default function Chat() {
  const dispatch = useDispatch();
  const me = useSelector((s) => s.auth.user);
  const { contacts, messages, unread, online, activeId, connected, loading, error } = useSelector((s) => s.chat);

  const [text, setText] = useState('');
  const [sendError, setSendError] = useState('');
  const [typingFrom, setTypingFrom] = useState(null);
  const bottomRef = useRef(null);
  const lastTypingSent = useRef(0);

  const active = contacts.find((c) => c.id === activeId);
  const thread = messages[activeId] || EMPTY;

  useEffect(() => {
    dispatch(fetchContacts());
    return () => { dispatch(setActiveChat(null)); };
  }, [dispatch]);

  // load history when a conversation is opened
  useEffect(() => {
    if (activeId) dispatch(fetchConversation(activeId));
  }, [activeId, dispatch]);

  // keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [thread.length, activeId]);

  // typing indicator
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;
    let timer;
    const onTyping = ({ from }) => {
      setTypingFrom(from);
      clearTimeout(timer);
      timer = setTimeout(() => setTypingFrom(null), 1800);
    };
    socket.on('chat:typing', onTyping);
    return () => { socket.off('chat:typing', onTyping); clearTimeout(timer); };
  }, [connected]);

  const handleChange = (e) => {
    setText(e.target.value);
    const socket = getSocket();
    const now = Date.now();
    if (socket && activeId && now - lastTypingSent.current > 1000) {
      lastTypingSent.current = now;
      socket.emit('chat:typing', { to: activeId });
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const body = text.trim();
    const socket = getSocket();
    if (!body || !activeId) return;
    if (!socket || !socket.connected) {
      setSendError('Not connected to the chat server. Please wait a moment and try again.');
      return;
    }
    setSendError('');
    socket.emit('chat:send', { to: activeId, text: body }, (res) => {
      if (!res?.ok) setSendError(res?.message || 'Message could not be sent');
    });
    setText(''); // the message itself appears via the server's "chat:message" event
  };

  if (loading && contacts.length === 0) return <Loader text="Loading chat..." />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchContacts())} />;

  return (
    <section className="container page">
      <div className="row-between">
        <h1>Messages</h1>
        <span className={`status-pill ${connected ? 'on' : 'off'}`}>{connected ? '● Connected' : '● Connecting...'}</span>
      </div>

      <div className={`chat ${activeId ? 'chat-open' : ''}`}>
        <aside className="chat-contacts" aria-label="Contacts">
          {contacts.length === 0 && <p className="muted pad">No other users yet. Register a second account in another tab to try the chat.</p>}
          {contacts.map((c) => (
            <button key={c.id} className={`contact ${c.id === activeId ? 'selected' : ''}`} onClick={() => dispatch(setActiveChat(c.id))}>
              <span className={`dot ${online.includes(c.id) ? 'dot-on' : 'dot-off'}`} />
              <span className="contact-name">
                {c.name}
                <small>{c.role === 'admin' ? 'Admin' : c.department || 'Student'}</small>
              </span>
              {unread[c.id] > 0 && <span className="count">{unread[c.id]}</span>}
            </button>
          ))}
        </aside>

        <div className="chat-window">
          {!active ? (
            <div className="chat-empty"><p>Select a contact to start chatting.</p></div>
          ) : (
            <>
              <div className="chat-header">
                <button className="back-btn" onClick={() => dispatch(setActiveChat(null))} aria-label="Back to contacts">←</button>
                <div>
                  <strong>{active.name}</strong>
                  <small className={online.includes(active.id) ? 'online' : ''}>
                    {typingFrom === active.id ? 'typing...' : online.includes(active.id) ? 'Online' : 'Offline'}
                  </small>
                </div>
              </div>

              <div className="chat-messages">
                {thread.length === 0 && <p className="muted center">No messages yet. Say hello 👋</p>}
                {thread.map((m) => (
                  <div key={m.id} className={`bubble ${m.from === me.id ? 'mine' : 'theirs'}`}>
                    <p>{m.text}</p>
                    <small>{formatTime(m.createdAt)}</small>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {sendError && <div className="alert alert-error">{sendError}</div>}
              <form className="chat-input" onSubmit={handleSend}>
                <input value={text} onChange={handleChange} placeholder="Type a message..." maxLength={1000} aria-label="Message" />
                <button type="submit" className="btn btn-primary" disabled={!text.trim()}>Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
