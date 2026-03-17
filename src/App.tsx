import { useState } from 'react';
import './App.css'
import { analyzePassword } from './utils/analyzePassword'

function App() {
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
            <input type="text" placeholder="" autoComplete="off" />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input type="password" placeholder="" autoComplete="off" />
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
          <li>Minimum Length ({'>='} 16) ✖✔</li>
          <li>Contains Lowercase Letters ✖</li>
          <li>Contains Uppercase Letters ✖</li>
          <li>Contains Numbers ✖</li>
          <li>Contains Special Characters ✖</li>
        </ul>

        <div className="panel-section-title">
          Suggestions for<br />
          Improvement
        </div>
        <div className="suggestions-box">
          <ul className="suggestions-list">
            <li>XXX</li>
            <li>XXX</li>
            <li>XXX</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;