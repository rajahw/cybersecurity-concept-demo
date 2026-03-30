import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {addMessage, getMessages, deleteMessage, formatTimestamp} from './utilities';
import type {Message} from './utilities';
import './MessagePage.css';

function MessagePage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [isRSA, setIsRSA] = useState(true);
    const username = localStorage.getItem('username') || '';


    function loadMessages() {
        const allMessages = getMessages();
        setMessages(allMessages);
    }

    function handleSendMessage() {
        if (inputValue.trim()) {
            addMessage(inputValue);
            setInputValue('');
            loadMessages();
        }
    }

    function handleDeleteMessage(id: string) {
        deleteMessage(id);
        loadMessages();
    }

    function userLogout() {
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        if (confirmLogout) {
            localStorage.removeItem('username');
            localStorage.removeItem('messages');
            navigate('/');
        }
    }

    function handleKeyPress(event: React.KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <div className="messages-layout">
            <div className="messages-title-badge">
                <h1>Messages</h1>
            </div>
            
            <div className={isRSA ? "messages-left-rsa" : "messages-left-aes"}>
                {/*Add the other divs for switching messages to encrypted/unencrypted*/}
                <div className={isRSA ? "rsa-button-container" : "aes-button-container"}>
                    <button className={isRSA ? "rsa-button" : "aes-button"} onClick={() => setIsEncrypted(!isEncrypted)}>
                        {isEncrypted ? 'Decrypt' : 'Encrypt'}
                    </button>
                </div>

                <div className={isRSA ? "rsa-button-container" : "aes-button-container"}>
                    <button className={isRSA ? "rsa-button" : "aes-button"} onClick={() => setIsRSA(!isRSA)}>
                        {isRSA ? 'RSA' : 'AES'}
                    </button>
                </div>

                <div className="explanation-container">
                    <div className="explanation-label">
                        Encrypted Message
                    </div>

                    <div className="explanation-item">
                        #####
                    </div>

                    <div className="explanation-symbol">
                        +
                    </div>

                    <div className="explanation-label">
                        Public Key
                    </div>

                    <div className="explanation-item">
                        #####
                    </div>

                    <div className="explanation-symbol">
                        =
                    </div>

                    <div className="explanation-item">
                        %%%%%%
                    </div>
                </div>

                <div className={isRSA ? "rsa-button-container" : "aes-button-container"}>
                    <button className={isRSA ? "rsa-button" : "aes-button"} onClick={userLogout}>
                        LOG OUT
                    </button>
                </div>

                <div className={isRSA ? "rsa-button-container" : "aes-button-container"}>
                    <a className={isRSA ? "rsa-button" : "aes-button"} href="https://pages.nist.gov/800-63-4/sp800-63b/passwords/" target="_blank" rel="noopener noreferrer">
                        LEARN MORE
                    </a>
                </div>
            </div>

            <div className="messages-right">
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
                                            <span className="message-info">
                                                <span>
                                                    {username}<br />{time.month}/{time.day}/{time.year} {time.hours}:{time.minutes}
                                                </span>
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
                        onChange={(event) => setInputValue(event.target.value)}
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
            </div>
        </div>
    );
}

export default MessagePage;