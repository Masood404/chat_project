import { Link } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container } from "react-bootstrap";

import MessengerLogo from "../images/messenger-logo.svg";

const Navbar = () => {
    return (
        <BsNavbar expand="md" className="p-3 sticky-top">
            <Container fluid={true}>
                <BsNavbar.Brand>
                    <Link to="/"><img src={MessengerLogo} alt="Messenger Navbar Brand" /></Link>
                </BsNavbar.Brand>
                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BsNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto mt-md-0 mt-2">
                        <Nav.Item className="mx-md-3">
                            <Nav.Link as={Link} to="/features">Features</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mx-md-3">
                            <Nav.Link as={Link} to="/download-app">Download app</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mx-md-3">
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
};

export default Navbar;