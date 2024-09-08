import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Login from './pages/Login';

import './App.scss';

function App() {
  return (
    <div className="App d-flex flex-column h-100 w-100" style={{
      position: 'fixed'
    }}>
      <Container className="py-2 my-2 h-100">
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
