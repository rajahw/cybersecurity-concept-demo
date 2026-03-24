import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './App.css';
import { checkForBreach, analyzePasswordRequirements, getScore } from './utilities';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { lengthCheck, lowercaseCheck, uppercaseCheck, numberCheck, specialCheck, suggestions } = analyzePasswordRequirements(password);
  const [breachCheck, setBreachCheck] = useState<boolean | undefined>(undefined);
  const score = getScore(lengthCheck, lowercaseCheck, uppercaseCheck, numberCheck, specialCheck, breachCheck);

  //HARD-CODED PASSWORDS: CHANGE AS NEEDED TO MAKE ACCOUNT FUNCTIONALITY

  /*
  const validUser = ["admin", "Rajah", "Nandi", "Shawn", "Tashamii", "Latrell"]    
  const validPass = ["admin", "Rajah", "Nandi", "sleep05", "Tashamii", "Latrell"]
  */

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

  //remove admin access if necessary
  function userLogin() {
    if (username.trim() && (suggestions.length === 0 || password === 'admin')) {
      onLogin(username);
      navigate('/messages');
    }
    else
      alert('Invalid username or password! Please try again.');
  }

  if (breachCheck === true && (lengthCheck || lowercaseCheck || uppercaseCheck || numberCheck || specialCheck))
    suggestions.push('PASSWORD FOUND IN A DATA BREACH');

  return (
    <div className="layout">
      {/* LEFT */}
      <div className="left">
        <div className="title-badge">
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
              } style={{width: `${score}%`}}></div>
            </div>
            <div className="strength-ticks">
              <span className="tick">WEAK</span>
              <span className="tick">FAIR</span>
              <span className="tick">GOOD</span>
              <span className="tick">STRONG</span>
            </div>
          </div>

          <div className="divider"></div>
        </div>

        {/* Login Button */}
        <div className="login-btn-container">
          <button className="login-btn" onClick={userLogin}>
            LOGIN
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        <div className="panel-section-title">Time to Crack</div>

        <div className="crack-box">
          <span className="crack-value">XXX</span>
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
          Suggestions for<br />
          Improvement
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