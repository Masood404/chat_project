import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import useForm from '../hooks/useForm';
import { useAuth } from '../hooks/AuthProvider';

import MessengerLogo from '../images/messenger-logo.svg';

const Login = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();
    
    const { handleSubmit, getInputProps, formData } = useForm({
        username: '',
        password: '',
        remember_me: false
    }, async () => {
        await login(formData);
    });

    useEffect(() => {
        if (accessToken) {
            navigate('/');
        }
    }, [accessToken]);

    return (
        <div className="h-100 d-flex flex-column">
            <div className="text-center d-flex justify-content-center align-items-center flex-column flex-grow-1">
                <div className="mb-5">
                    <img src={MessengerLogo} id="messenger-logo" alt="Messenger Logo" />
                </div>

                <h2 className="fw-normal mb-5">Messenger Clone Login</h2>

                <Form className="w-100" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <Form.Control 
                            {...getInputProps('username', 'text')}
                            placeholder="Username" 
                            className="mx-auto py-2"
                            style={{
                                width: 286,
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Control 
                            {...getInputProps('password', 'password')}
                            placeholder="Password" 
                            className="mx-auto py-2"
                            style={{
                                width: 286,
                            }}
                        />
                    </div>
                    <Button 
                        type="submit"
                        variant="vivid-blue" 
                        className="rounded-pill py-2 px-3 text-white mb-5"
                    >
                        Continue
                    </Button>
                    <div className="d-flex justify-content-center">
                        <Form.Check> 
                            <Form.Check.Input 
                                {...getInputProps('remember_me', 'checkbox')}
                                className="checked-bg-vivid-blue"
                            />
                            <Form.Check.Label className="text-secondary fw-light">
                                Keep me signed in
                            </Form.Check.Label>
                        </Form.Check>
                    </div>
                </Form>
            </div>
            <footer className="row text-center justify-content-center text-nowrap gap-2 fw-light">
                <div className="col-6 col-sm-4 col-lg-2">
                    <Link to="/register" className="text-decoration-none link-dark">
                        Register
                    </Link>
                </div>
                <div className="col-6 col-sm-4 col-lg-2">
                    <Link to="/reset-password" className="text-decoration-none link-dark">
                        Forgotten Password
                    </Link>
                </div>
                <div className="col-6 col-sm-4 col-lg-2 ">
                    <a href="https://messenger.com" className="text-decoration-none link-dark">
                        Messenger
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Login;