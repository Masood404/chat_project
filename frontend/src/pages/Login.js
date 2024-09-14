import { useEffect, useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import useForm from '../hooks/useForm';
import { useAuth } from '../hooks/AuthProvider';

import MessengerLogo from '../images/messenger-logo.svg';

import NonFieldErrors from '../components/NonFieldErrors';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();

    const { formData, formErrors, isSubmitting, handleSubmit, getInputProps } = useForm({
        username: '',
        password: '',
        remember_me: false
    }, async () => { await login(formData); });

    useEffect(() => {
        if (accessToken) {
            navigate('/');
        }
    }, [accessToken]);

    return (
        <div className="vh-100 d-flex flex-column">
            <div className="text-center d-flex justify-content-center align-items-center flex-column flex-grow-1">
                <div className="mb-4">
                    <img src={MessengerLogo} id="messenger-logo" alt="Messenger Logo" />
                </div>

                <h1 className="fw-normal mb-4">Messenger Clone Login</h1>

                <Form className="w-100" onSubmit={handleSubmit}>

                    <NonFieldErrors non_field_errors={formErrors.non_field_errors} />

                    <Input
                        className="mx-auto"
                        {...getInputProps('username', 'text')}
                    />

                    <Input
                        className="mx-auto mb-2"
                        {...getInputProps('password', 'password')}
                    />

                    <Button
                        type="submit"
                        isSubmitting={isSubmitting}
                        submittingText="Continuing..."
                        className="mb-5"
                    >
                        Continue
                    </Button>

                    <div className="d-flex justify-content-center">
                        <Form.Check>
                            <Form.Check.Input
                                {...getInputProps('remember_me', 'checkbox')}
                            />
                            <Form.Check.Label className="text-secondary fw-light">
                                Keep me signed in
                            </Form.Check.Label>
                        </Form.Check>
                    </div>
                </Form>
            </div>

            <Container fluid>
                <footer className="row text-center justify-content-center text-nowrap g-2 py-2">
                    <div className="col-6 col-sm-4 col-md-2">
                        <Link to="/register">
                            Register
                        </Link>
                    </div>
                    <div className="col-6 col-sm-4 col-md-2">
                        <Link to="/reset-password">
                            Forgotten Password
                        </Link>
                    </div>
                    <div className="col-6 col-sm-4 col-md-2 ">
                        <Link to="/">
                            Messenger
                        </Link>
                    </div>
                </footer>
            </Container>
        </div>
    );
};

export default Login;