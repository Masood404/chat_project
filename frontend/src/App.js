import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './App.scss';

import Login from './pages/Login';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import PrivateRoute from './routing/PrivateRoute';

import PublicRoute from './routing/PublicRoute';

function App() {
	return (
		<div className="App">
			<Container className="py-2 my-2 h-100">
				<Routes>
					<Route element={<PrivateRoute />}>
						{["/", "/home"].map((path, i) => <Route key={i} exact path={path} element={<Home />} />)}
					</Route>
					<Route element={<PublicRoute />}>
						<Route exact path="/login" element={<Login />} />
					</Route>
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</Container>
		</div>
	);
}

export default App;
