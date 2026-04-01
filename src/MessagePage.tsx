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

import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {addMessage, getMessages, deleteMessage, formatTimestamp, encryptMessageRSA, encryptMessageAES} from './utilities';
import type {Message} from './utilities';
import './MessagePage.css';

function MessagePage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [isRSA, setIsRSA] = useState(true);
    const [encryptButtonPressed, setEncryptButtonPressed] = useState(false);
    const [highlightedMessage, setHighlightedMessage] = useState('');
    const [rsaEncrypted, setRsaEncrypted] = useState<string | undefined>(undefined);
    const [rsaPublicKey, setRsaPublicKey] = useState<string | undefined>(undefined);
    const [rsaPrivateKey, setRsaPrivateKey] = useState<string | undefined>(undefined);
    const [aesEncrypted, setAesEncrypted] = useState<string | undefined>(undefined);
    const [aesKey, setAesKey] = useState<string | undefined>(undefined);
    const highlightedContent = messages.find(msg => msg.id === highlightedMessage)?.content || '';
    const username = localStorage.getItem('username') || '';
    const messagesEmpty = messages.length === 0;

    useEffect(() => {
        async function encrypt() {
            try {
                const rsaResponse = await encryptMessageRSA(highlightedContent);
                const aesResponse = await encryptMessageAES(highlightedContent);

                const rsaE = rsaResponse?.encryptedMessage;
                const rsaPub = rsaResponse?.publicKeyText;
                const rsaPriv = rsaResponse?.privateKeyText;
                const aesE = aesResponse?.encryptedMessage;
                const aesK = aesResponse?.keyText;

                setRsaEncrypted(rsaE);
                setRsaPublicKey(rsaPub);
                setRsaPrivateKey(rsaPriv);
                setAesEncrypted(aesE);
                setAesKey(aesK);
            } catch (error) {
                console.error(error);
                return undefined;
            }
        }
        encrypt();
    }, [highlightedContent]);
    
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

    function handleHighlightMessage(id: string) {
        setHighlightedMessage(highlightedMessage === id ? '' : id);
    }

    function handleEncryptButtonPress() {
        setIsEncrypted(!isEncrypted);
        if (!encryptButtonPressed)
            setEncryptButtonPressed(true);
    }

    function userLogout() {
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        if (confirmLogout) {
            localStorage.removeItem('username');
            localStorage.removeItem('messages');
            setEncryptButtonPressed(false);
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
                <div className={isRSA ? "rsa-button-container" : "aes-button-container"}>
                    <button className={isRSA ? "rsa-button" : "aes-button"} onClick={() => handleEncryptButtonPress()}>
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
                        {/*Display "Select a message, then press \"Encrypt\"" when no message is highlighted*/}
                        {/*Change this div*/}
                        {encryptButtonPressed ? !messagesEmpty
                        ? isEncrypted
                        ? "Encrypted Message" :
                        "Unencrypted Message" :
                        "Select a message, then press \"Encrypt\"" :
                        "Select a message, then press \"Encrypt\""}
                    </div>

                    <div className="explanation-item">
                        {highlightedMessage !== '' ? highlightedContent : ""}
                    </div>

                    <div className="explanation-symbol">
                        {encryptButtonPressed ? "+" : ""}
                    </div>

                    <div className="explanation-label">
                        {/*Change this div*/}
                        {encryptButtonPressed ? "Public Key" : ""}
                    </div>

                    <div className="explanation-item">
                        {highlightedMessage !== '' ? rsaPublicKey : ""}
                    </div>

                    <div className="explanation-symbol">
                        {encryptButtonPressed ? "=" : ""}
                    </div>

                    <div className="explanation-item">
                        {/*Change this div*/}
                        {highlightedMessage !== '' ? 
                        encryptButtonPressed ? rsaEncrypted : ""
                        : ""}
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
                    {!messagesEmpty ? (
                        <ul className="messages-list">
                            {messages.map((message) => {
                                const time = formatTimestamp(message.timestamp);
                                return (
                                    <li
                                        key={message.id}
                                        className={highlightedMessage === message.id ? "message-item-highlighted" : "message-item"}
                                        onClick={() => handleHighlightMessage(message.id)}
                                    >
                                        <div className="message-content">
                                            {/*Change this div*/}
                                            <p>{isEncrypted ?
                                            highlightedMessage === message.id ?
                                            isRSA ? rsaEncrypted : aesEncrypted :
                                            message.content : message.content}</p>
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