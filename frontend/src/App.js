import { Routes, Route, useRoutes } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Login from './pages/Login';
import Home from './pages/Home';

import './App.scss';
import PageNotFound from './pages/PageNotFound';

function App() {
    const routes = useRoutes([
        ...['/', '/home'].map(path => ({ path, element: <Home /> })),
		{ path: "/login", element: <Login /> },
		{ path: "*", element: <PageNotFound /> }
    ]);

    return (
        <div className="App d-flex flex-column h-100 w-100">
            <Container className="py-2 my-2 h-100">
                {routes}
            </Container>
        </div>
    );
}

export default App;
