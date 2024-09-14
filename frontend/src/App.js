import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import "./App.scss";

import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Features from "./pages/Features";
import DownloadApp from "./pages/DownloadApp";

import PrivateRoute from "./routing/PrivateRoute";
import PublicRoute from "./routing/PublicRoute";
import WithNavbar from "./routing/WithNavbar";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route element={<WithNavbar />}>
					{["/", "/home"].map((path, i) => <Route key={i} exact path={path} element={<Home />} />)}
					<Route exact path="/features" element={<Features />} />
					<Route exact path="/download-app" element={<DownloadApp />} />
				</Route>

				<Route element={<PublicRoute />}>
					<Route exact path="/login" element={<Login />} />
				</Route>
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</div>
	);
}

export default App;
