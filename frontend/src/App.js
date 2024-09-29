import { Routes, Route } from "react-router-dom";

import "./App.scss";

import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Features from "./pages/Features";
import DesktopApp from "./pages/DesktopApp";
import StartDownload from "./pages/StartDownload";

import PublicRoute from "./routing/PublicRoute";
import WithNavbar from "./routing/WithNavbar";

function App() {
	return (
		<div className="App">
			<Routes>
				{["/", "/home"].map((path, i) => <Route key={i} exact path={path} element={<Home />} />)}
				<Route exact path="/home/:sideListParam" element={<Home />} />
				<Route element={<WithNavbar />}>
					<Route exact path="/features" element={<Features />} />
					<Route exact path="/desktop" element={<DesktopApp />} />
				</Route>
				<Route element={<PublicRoute />}>
					<Route exact path="/login" element={<Login />} />
				</Route>
				<Route exact path="/desktop/start-download" element={<StartDownload />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</div>
	);
}

export default App;
