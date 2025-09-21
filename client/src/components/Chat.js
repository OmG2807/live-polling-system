import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeChat } from '../store/chatSlice';

const Chat = ({ onSendMessage, userType }) => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
        <button
          className="close-chat-btn"
          onClick={() => dispatch(closeChat())}
        >
          ×
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.senderType === userType ? 'own-message' : 'other-message'
              }`}
            >
              <div className="message-header">
                <span className="sender-name">
                  {message.senderName}
                  {message.senderType === 'teacher' && ' 👨‍🏫'}
                  {message.senderType === 'student' && ' 👨‍🎓'}
                </span>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div className="message-content">
                {message.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          maxLength="200"
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
