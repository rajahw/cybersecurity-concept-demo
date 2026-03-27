import {Routes, Route} from 'react-router-dom';
import LoginPage from './LoginPage';
import MessagePage from './MessagePage';

function App() {
  function saveUsername(username: string) {
    localStorage.setItem('username', username);
  }

  return (
    <Routes>
      <Route path='/' element={<LoginPage onLogin={saveUsername} />} />
      <Route path='/messages' element={<MessagePage />} />
    </Routes>
  );
}

export default App;