import { Button, Form } from 'react-bootstrap';

import MessengerLogo from '../images/messenger-logo.svg';

const Login = () => {
    return (
        <div className="text-center d-flex justify-content-center align-items-center flex-column" style={{
            height: "100%"
        }}>
            <div className="mb-5">
                <img src={MessengerLogo} id="messenger-logo" alt="Messenger Logo" />
            </div>

            <h2 className="fw-normal mb-4">Messenger Clone Login</h2>

            <Form className="w-100">
                <div className="mb-3">
                    <Form.Control 
                        type="text" 
                        placeholder="Email address or username" 
                        className="mx-auto py-2"
                        style={{
                            width: 286,
                        }}
                    />
                </div>
                <div className="mb-3">
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        className="mx-auto py-2"
                        style={{
                            width: 286,
                        }}
                    />
                </div>
                <Button variant="vivid-blue" className="rounded-pill py-2 px-3 text-white">Continue</Button>
            </Form>
        </div>
    );
};

export default Login;