import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Login from './pages/Login';

import './App.scss';

function App() {
  return (
    <div className="App" style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100%',
      width: '100%',
    }}>
      <Container className="py-2 my-2" style={{
        height: '100%'
      }}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
