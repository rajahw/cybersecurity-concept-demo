import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CaesarPage.css';

function CaesarPage() {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [shift, setShift] = useState(3);
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

    function caesarCipher(text: string, shift: number, decrypt: boolean): string {
        const s = decrypt ? (26 - shift) % 26 : shift;
        return text.split('').map(char => {
            if (/[a-z]/.test(char)) return String.fromCharCode(((char.charCodeAt(0) - 97 + s) % 26) + 97);
            if (/[A-Z]/.test(char)) return String.fromCharCode(((char.charCodeAt(0) - 65 + s) % 26) + 65);
            return char;
        }).join('');
    }

    const outputText = inputText ? caesarCipher(inputText, shift, mode === 'decrypt') : '';

    return (
        <div className="caesar-layout">
            <div className="caesar-title-badge">
                <h1>Caesar<br />Cipher</h1>
            </div>

            <div className="caesar-left">
                <div className="caesar-mode-container">
                    <button
                        className="caesar-button"
                        onClick={() => setMode('encrypt')}
                    >
                        ENCRYPT
                    </button>
                    <button
                        className="caesar-button"
                        onClick={() => setMode('decrypt')}
                    >
                        DECRYPT
                    </button>
                </div>

                <div className="caesar-shift-section">
                    <label className="caesar-label">Shift: {shift}</label>
                    <input
                        type="range"
                        min={1}
                        max={25}
                        value={shift}
                        onChange={e => setShift(Number(e.target.value))}
                        className="caesar-slider"
                    />
                    <div className="caesar-shift-ticks">
                        <span className="tick">1</span>
                        <span className="tick">25</span>
                    </div>
                </div>

                <div className="caesar-nav-container">
                    <button className="caesar-button" onClick={() => navigate('/messages')}>
                        MESSAGES
                    </button>
                </div>

                <div className="caesar-nav-container">
                    <a className="caesar-button" href="https://www.geeksforgeeks.org/ethical-hacking/caesar-cipher-in-cryptography/" target="_blank" rel="noopener noreferrer">
                        LEARN MORE
                    </a>
                </div>
            </div>

            <div className="caesar-right">
               
                <div className="caesar-panel">
                    <div className="panel-section-title">Input</div>
                    <textarea
                        className="caesar-textarea"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Type your message here..."
                        rows={5}
                    />
                </div>

                <div className="caesar-arrow">▼</div>

                <div className="caesar-panel">
                    <div className="panel-section-title">Output</div>
                    <div className="caesar-output">
                        {outputText || <span className="caesar-placeholder">Output will appear here...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CaesarPage;