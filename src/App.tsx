import { useState } from 'react';
import './App.css';
import { analyzePassword } from './utilities';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { lengthCheck, lowercaseCheck, uppercaseCheck, numberCheck, specialCheck, suggestions } = analyzePassword(password);

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
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              placeholder=""
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="strength-section">
          <span className="strength-label">Strength</span>
          <div className="strength-track">
            <div className="strength-fill" style={{ width: '0%' }}></div>
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

      {/* RIGHT */}
      <div className="right">
        <div className="panel-section-title">Time to Crack</div>

        <div className="crack-box">
          <span className="crack-value">XXX</span>
        </div>

        <div className="panel-section-title">Requirements</div>
        <ul className="analysis-list">
          <li className={lengthCheck ? "met" : "unmet"}>
            {lengthCheck ? "Minimum Length (>= 16) ✔" : "Minimum Length (>= 16) ✖"}
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
            {suggestions.length > 0 ? suggestions.map((item, i) => (<li className="unmet" key={i}>{item}</li>)) : <li className="met">No suggestions ✔</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;