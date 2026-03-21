import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import MessagePage from './MessagePage';

function App() {
  return (
    <Routes>
      <Route path = '/' element = {<LoginPage />} />
      <Route path = '/messages' element = {<MessagePage />} />
    </Routes>
  );
}

export default App;
