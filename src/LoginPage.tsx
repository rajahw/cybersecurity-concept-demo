import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getCrackInfo, checkForBreach, analyzePasswordRequirements, getScore} from './utilities';
import './LoginPage.css';

function LoginPage({onLogin}: {onLogin: (username: string) => void}) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {crackTime, crackScore} = getCrackInfo(password);
    const [breachCheck, setBreachCheck] = useState<boolean | undefined>(undefined);
    const {lengthCheck, lowercaseCheck, uppercaseCheck, numberCheck, specialCheck, suggestions} = analyzePasswordRequirements(password);
    const score = getScore(lengthCheck, lowercaseCheck, uppercaseCheck, numberCheck, specialCheck, breachCheck);

    useEffect(() => {
        async function check() {
            try {
                const breached = await checkForBreach(password);
                setBreachCheck(breached);
            } catch (error) {
                console.error(error);
                setBreachCheck(undefined);
            }
        }
        check();
    }, [password]);

    function userLogin() {
        if (username.trim() && !/\s/.test(password) && (suggestions.length === 0 || password === 'admin')) {
            onLogin(username);
            navigate('/messages');
        }
        else
            alert('Invalid username or password! Please try again.');
    }

    if (breachCheck === true && password.length > 0)
        suggestions.push('PASSWORD FOUND IN A DATA BREACH');

    return (
        <div className="login-layout">
            <div className="login-left">
                <div className="login-title-badge">
                    <h1>
                        Password Strength<br />
                        Analyzer
                    </h1>
                </div>

                <div className="form-section">
                    <div className="field-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder=""
                            autoComplete="off"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>

                    <div className="field-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder=""
                            autoComplete="off"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <div className="strength-section">
                        <span className="strength-label">Strength</span>
                        <div className="strength-track">
                            <div className={
                                score === 100 ? "strength-fill-strong" :
                                score >= 60 ? "strength-fill-good" :
                                score >= 45 ? "strength-fill-fair" :
                                "strength-fill-weak"
                            } style={{width: `${score}%`}} />
                        </div>
                        <div className="strength-ticks">
                            <span className="tick">WEAK</span>
                            <span className="tick">FAIR</span>
                            <span className="tick">GOOD</span>
                            <span className="tick">STRONG</span>
                        </div>
                    </div>
                </div>

                <div className="divider" />

                <div className="login-button-container">
                    <button className="login-button" onClick={userLogin}>
                        LOG IN
                    </button>
                </div>

                <div className="tip">
                    Use "admin" as a password to bypass the requirements
                </div>

                <div className="divider" />

                <div className="login-learn-more-button-container">
                    <a className="login-learn-more-button" href="https://pages.nist.gov/800-63-4/sp800-63b/passwords/" target="_blank" rel="noopener noreferrer">
                        LEARN MORE
                    </a>
                </div>
            </div>

            <div className="login-right">
                <div className="panel-section-title">Time to Crack</div>

                <div className="crack-box">
                    <span className={crackScore === 4 ? "crack-value-strong" :
                        crackScore === 3 ? "crack-value-good" :
                        crackScore === 2 ? "crack-value-fair" :
                        "crack-value-weak"
                    }>{password.length > 0 ? crackTime : ''}</span>
                </div>

                <div className="panel-section-title">Requirements</div>
                <ul className="analysis-list">
                    <li className={lengthCheck ? "met" : "unmet"}>
                        {lengthCheck ? "Minimum Length (>= 12) ✔" : "Minimum Length (>= 12) ✖"}
                    </li>
                    <li className={lowercaseCheck ? "met" : "unmet"}>
                        {lowercaseCheck ? "Contains Lowercase Letters ✔" : "Contains Lowercase Letters ✖"}
                    </li>
                    <li className={uppercaseCheck ? "met" : "unmet"}>
                        {uppercaseCheck ? "Contains Uppercase Letters ✔" : "Contains Uppercase Letters ✖"}
                    </li>
                    <li className={numberCheck ? "met" : "unmet"}>
                        {numberCheck ? "Contains Numbers ✔" : "Contains Numbers ✖"}
                    </li>
                    <li className={specialCheck ? "met" : "unmet"}>
                        {specialCheck ? "Contains Special Characters ✔" : "Contains Special Characters ✖"}
                    </li>
                </ul>

                <div className="panel-section-title">
                    Suggestions for Improvement
                </div>
                <div className="suggestions-box">
                    <ul className="suggestions-list">
                        {suggestions.length > 0
                            ? suggestions.map((item, index) => (
                                    <li className="unmet" key={index}>
                                        {item}
                                    </li>
                                ))
                            : <li className="met">No suggestions ✔</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;