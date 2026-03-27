import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {addMessage, getMessages, deleteMessage, formatTimestamp} from './utilities';
import type {Message} from './utilities';

interface MessagePageProps {
    savedUsername: string;
}

function MessagePage({savedUsername}: MessagePageProps) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        loadMessages();
    }, []);

    function loadMessages() {
        const allMessages = getMessages();
        setMessages(allMessages);
    }

    function handleSendMessage() {
        if (inputValue.trim()) {
            addMessage(savedUsername, inputValue);
            setInputValue('');
            loadMessages();
        }
    }

    function handleDeleteMessage(id: string) {
        deleteMessage(id);
        loadMessages();
    }

    function userLogout() {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            navigate("/");
        }
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

  return (
    <div className="messagePage">
        <div className="messages-header">
            <h1>Messages</h1>
        </div>

        <div className="messages-container">
            {messages.length > 0 ? (
                <ul className="messages-list">
                    {messages.map((message) => {
                        const time = formatTimestamp(message.timestamp);
                        return (
                            <li key={message.id} className="message-item">
                                <div className="message-content">
                                    <p>{message.content}</p>
                                </div>
                                <div className="message-footer">
                                    <span className="message-timestamp">
                                        {time.month}/{time.day}/{time.year} {time.hours}:{time.minutes}
                                    </span>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteMessage(message.id)}
                                        title="Delete message"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="empty-state">
                    <p>No messages yet. Start a conversation!</p>
                </div>
            )}
        </div>

        <div className="compose-section">
            <textarea
                className="message-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send)"
                rows={3}
            />
            <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
            >
                Send Message
            </button>
        </div>

        <div className="logout-button-container">
              <button className="logout-button" onClick={userLogout}>
                LOGOUT
              </button>
        </div>
      </div>
    );
}

export default MessagePage;