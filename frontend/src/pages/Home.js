import { Link } from "react-router-dom";
import { Form, Container } from "react-bootstrap";

import { useAuth } from "../hooks/AuthProvider";
import useForm from "../hooks/useForm";

import MessengerRegister from "../images/messenger-register-image.png";
import AppStore from "../images/app-store.svg";
import MicrosoftStore from "../images/microsoft-store.png";

import WithNavbar from "../routing/WithNavbar";
import Input from "../components/Input";
import Button from "../components/Button";
import NonFieldErrors from "../components/NonFieldErrors";

const PublicHome = ({ auth }) => {
    const { register } = auth;

    const { formErrors, isSubmitting, handleSubmit, getInputProps } = useForm({
        first_name: '',
        last_name: '',
        username: '',
        email_address: '',
        password: '',
        confirmation: ''
    }, register);

    return (
        <div className="row g-3 px-4 px-xxl-10">
            <div className="col-12 col-lg-6 text-center text-lg-start d-flex flex-column align-items-center align-items-lg-start">
                <h1 className="ls-2 fs-0 lh-1 theme-gradient-horizontal mb-5">
                    Hang out
                    <br />
                    whenever,
                    wherever
                </h1>
                <div className="fw-normal mb-5">
                    Messenger makes it easy and fun to stay close to your
                    <br />
                    favourite people.
                </div>
                <Form className="mb-4" onSubmit={handleSubmit}>
                    <NonFieldErrors non_field_errors={formErrors.non_field_errors} />

                    <Input
                        customVariant="secondary"
                        {...getInputProps('first_name', 'text')}
                    />
                    <Input
                        customVariant="secondary"
                        {...getInputProps('last_name', 'text')}
                    />
                    <Input
                        customVariant="secondary"
                        {...getInputProps('username', 'text')}
                    />
                    <Input
                        customVariant="secondary"
                        {...getInputProps('email_address', 'email')}
                    />
                    <Input
                        customVariant="secondary"
                        {...getInputProps('password', 'password')}
                    />
                    <Input
                        className="mb-2"
                        customVariant="secondary"
                        {...getInputProps('confirmation', 'password')}
                    />

                    <div className="d-flex gap-4 align-items-center">
                        <Button
                            type="submit"
                            isSubmitting={isSubmitting}
                            submittingText="Registering..."
                        >
                            Register
                        </Button>
                        <div>
                            <Link className="link-primary fw-semibold" to="/login">Already registered?</Link>
                        </div>
                    </div>
                </Form>
                <div className="d-flex gap-2">
                    <a href="https://apps.apple.com/us/app/messenger/id1480068668?mt=12">
                        <img src={AppStore} alt="Download on the App Store" style={{
                            width: 130,
                            height: 44
                        }} />
                    </a>
                    <a href="https://www.microsoft.com/en-us/p/messenger/9wzdncrf0083?activetab=pivot:overviewtab">
                        <img src={MicrosoftStore} alt="Get it from Microsoft" style={{
                            width: 120,
                            height: 43
                        }} />
                    </a>
                </div>
            </div>
            <div className="col-12 col-lg-6 d-flex align-items-center justify-content-lg-end justify-content-center">
                <img className="w-90 object-fit-contain" src={MessengerRegister} alt="Messenger Register Image" />
            </div>
        </div>
    );
};

const PrivateHome = ({ auth }) => {
    const { logout } = auth;

    return (
        <div>
            This is private home <Link to="/login" onClick={logout}>Logout</Link>
        </div>
    );
};

const Home = () => {
    const auth = useAuth();

    return auth.accessToken ? <PrivateHome auth={auth} /> : (
        <WithNavbar isRoute={false}>
            <PublicHome auth={auth} />
        </WithNavbar>
    );
};

export default Home;