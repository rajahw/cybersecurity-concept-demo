import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import MessagePage from './MessagePage';

function App() {
  const [savedUsername, setSavedUsername] = useState('');

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={setSavedUsername} />} />
      <Route path="/messages" element={<MessagePage savedUsername={savedUsername} />} />
    </Routes>
  );
}

export default App;