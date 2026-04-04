/*
Change encrypt/decrypt button to two buttons, greying out one

Update UI to show that RSA encrypts with the public key and decrypts with the private key
    -Change UI depending on whether encrypting or decrypting

Update UI to show that AES encrypts and decrypts with the same key
    -Keep the UI the same between encrypting and decrypting

Keep the encrypted/decrypted state of the message content after deselecting
    -Store the isEncrypted state in each message object instead of using a useState

Change message content font to prevent unknown characters after encryption
    -Lucida Sans Unicode or Lucida Grande?
*/

import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {addMessage, getMessages, deleteMessage, formatTimestamp, setEncryptedRSA, setEncryptedAES, setDecrypted} from './utilities';
import type {Message} from './utilities';
import './MessagePage.css';

function MessagePage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [highlightedMessageID, setHighlightedMessageID] = useState('');
    const [highlightedMessage, setHighlightedMessage] = useState<Message>();
    const [encryptionShouldDisplay, setEncryptionShouldDisplay] = useState(false);
    const [displayRSA, setDisplayRSA] = useState(true);
    const username = localStorage.getItem('username') || '';
    const messageIsSelected = highlightedMessageID !== '';

    console.log(highlightedMessage?.aesKey);
    
    function loadMessages() {
        const messages = getMessages();
        setMessages(messages);
        return messages;
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
        if (highlightedMessageID === id) {
            setHighlightedMessageID('');
            setHighlightedMessage(undefined);
        }
        loadMessages();
    }

    function handleHighlightMessage(id: string) {
        if (highlightedMessageID === id) {
            setHighlightedMessageID('');
            setHighlightedMessage(undefined);
        } else {
            const message = messages.find(msg => msg.id === id);
            setHighlightedMessageID(id);
            setHighlightedMessage(message);
            setEncryptionShouldDisplay(false);
        }
    }

    async function handleEncryptButtonPress() {
        if (messageIsSelected) {
            if (displayRSA) {
                await setEncryptedRSA(highlightedMessageID);
            } else {
                await setEncryptedAES(highlightedMessageID);
            }
            setEncryptionShouldDisplay(true);
            const messages = loadMessages();
            const message = messages.find(msg => msg.id === highlightedMessageID);
            setHighlightedMessage(message);
        }
    }

    function handleDecryptButtonPress() {
        if (messageIsSelected) {
            setDecrypted(highlightedMessageID);
            setEncryptionShouldDisplay(true);
            const messages = loadMessages();
            const message = messages.find(msg => msg.id === highlightedMessageID);
            setHighlightedMessage(message);
        }
    }

    function userLogout() {
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        if (confirmLogout) {
            localStorage.removeItem('username');
            localStorage.removeItem('messages');
            navigate('/');
        }
    }

    function handleRSAPress() {
        if (!highlightedMessage?.isEncrypted)
            setDisplayRSA(true);
    }

    function handleAESPress() {
        if (!highlightedMessage?.isEncrypted)
            setDisplayRSA(false);
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
            
            <div className={displayRSA ? "messages-left-rsa" : "messages-left-aes"}>
                <div className="two-button-container">
                    <button className={displayRSA ? "rsa-button" : "aes-button"} onClick={() => handleEncryptButtonPress()}>
                        Encrypt
                    </button>

                    <button className={displayRSA ? "rsa-button" : "aes-button"} onClick={() => handleDecryptButtonPress()}>
                        Decrypt
                    </button>
                </div>

                <div className="two-button-container">
                    <button className={displayRSA ? "rsa-button" : "aes-button"} onClick={() => handleRSAPress()}>
                        RSA
                    </button>

                    <button className={displayRSA ? "rsa-button" : "aes-button"} onClick={() => handleAESPress()}>
                        AES
                    </button>
                </div>

                <div className="explanation-container">
                    <div className="explanation-label">
                        {highlightedMessage && encryptionShouldDisplay ?
                        highlightedMessage.isEncrypted ?
                        "Unencrypted Message" :
                        "Encrypted Message" :
                        "Select a message to encrypt or decrypt"}
                    </div>

                    <div className="explanation-item">
                        {highlightedMessage && encryptionShouldDisplay ?
                        highlightedMessage.isEncrypted ?
                        highlightedMessage.content :
                        highlightedMessage.isRSA ?
                        highlightedMessage.rsaEncrypted :
                        highlightedMessage.aesEncrypted :
                        ""}
                    </div>

                    <div className="explanation-symbol">
                        {highlightedMessage && encryptionShouldDisplay ? "+" : ""}
                    </div>

                    <div className="explanation-label">
                        {highlightedMessage && encryptionShouldDisplay ?
                        highlightedMessage.isRSA ?
                        highlightedMessage.isEncrypted ?
                        "Public Key" :
                        "Private Key" :
                        "Key" :
                        ""}
                    </div>

                    <div className="explanation-item">
                        {highlightedMessage && encryptionShouldDisplay ?
                        highlightedMessage.isRSA ?
                        highlightedMessage.isEncrypted ?
                        highlightedMessage.rsaPublicKey :
                        highlightedMessage.rsaPrivateKey :
                        highlightedMessage.aesKey :
                        ""}
                    </div>

                    <div className="explanation-symbol">
                        {highlightedMessage && encryptionShouldDisplay ? "=" : ""}
                    </div>

                    <div className="explanation-item">
                        {highlightedMessage && encryptionShouldDisplay ?
                        highlightedMessage.isEncrypted ?
                        highlightedMessage.isRSA ?
                        highlightedMessage.rsaEncrypted :
                        highlightedMessage.aesEncrypted :
                        highlightedMessage.content :
                        ""}
                    </div>
                </div>
                
                <div className={displayRSA ? "rsa-button-container" : "aes-button-container"}>
                    <button className={displayRSA ? "rsa-button" : "aes-button"} onClick={() => navigate('/caesar')}>
                        CAESAR CIPHER
                    </button>
                </div>

                <div className="button-container">
                    <button className={displayRSA ? "rsa-button" : "aes-button"} onClick={userLogout}>
                        LOG OUT
                    </button>
                </div>

                <div className="button-container">
                    <a className={displayRSA ? "rsa-button" : "aes-button"}
                    href={displayRSA ?
                    "https://www.geeksforgeeks.org/computer-networks/rsa-and-digital-signatures/" :
                    "https://www.geeksforgeeks.org/computer-networks/advanced-encryption-standard-aes/"}
                    target="_blank" rel="noopener noreferrer">
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
                                    <li
                                        key={message.id}
                                        className={highlightedMessageID === message.id ? "message-item-highlighted" : "message-item"}
                                        onClick={() => handleHighlightMessage(message.id)}
                                    >
                                        <div className="message-content">
                                            <p>{message.isEncrypted ?
                                            message.isRSA ? message.rsaEncrypted : message.aesEncrypted :
                                            message.content}</p>
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