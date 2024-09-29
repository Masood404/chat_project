import classNames from "classnames";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dropdown, Form, Button as BsButton } from "react-bootstrap";

import { useAuth } from "../hooks/AuthProvider";
import useForm from "../hooks/useForm";
import useIsMac from "../hooks/useIsMac";

import MessengerRegister from "../images/messenger-register-image.png";
import AppStore from "../images/app-store.svg";
import MicrosoftStore from "../images/microsoft-store.png";

import Chats from "../containers/side-lists/Chats";
import ChatRequests from "../containers/side-lists/ChatRequests";
import Archive from "../containers/side-lists/Archive";
import WithNavbar from "../routing/WithNavbar";
import Input from "../components/Input";
import Button from "../components/Button";
import NonFieldErrors from "../components/NonFieldErrors";
import Pfp from "../components/Pfp";

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

//#region Private Home Components

const sideListsConfig = {
    chats: { icon: <i className="bi bi-chat-fill"></i>, component: Chats },
    chatRequests: { icon: <i className="bi bi-chat-dots-fill"></i>, component: ChatRequests },
    archive: { icon: <i className="bi bi-archive-fill"></i>, component: Archive }
};

const SideNavButton = ({ children, onClick, active = false }) => {
    return (
        <BsButton className="w-100 px-1 d-block" variant="transparent" size="lg" onClick={onClick} active={active}>
            {children}
        </BsButton>
    );
};

const DropdownItem = ({ children, icon, className = "", ...props }) => {
    return (
        <li>
            <Dropdown.Item {...props} className={classNames(
                "fw-medium d-flex gap-3 p-2 text-decoration-none",
                className
            )}>
                <div className="w-p-6 h-p-6 rounded-circle bg-body-secondary d-flex justify-content-center align-items-center">
                    {icon ? icon : <i className="bi bi-info-circle-fill"></i>}
                </div>
                <div className="flex-grow-1">
                    {children}
                </div>
            </Dropdown.Item>
        </li>
    );
};

const DropdownDivider = () => {
    return <Dropdown.Divider className="mx-2" />
};

const PrivateHome = ({ auth }) => {
    const { logout } = auth;
    const navigate = useNavigate();
    const { sideListParam } = useParams();
    const isMac = useIsMac();

    const [messages, setMessages] = useState([]);
    const [showSideList, setShowSideList] = useState(false);
    const [sideList, setSideList] = useState(sideListParam || 'chats');

    // Update navigation on sideList change
    useEffect(() => {
        navigate(`/home/${sideList}`);
    }, [sideList, navigate]);

    // Set sideList based on URL parameter
    useEffect(() => {
        if (sideListParam && sideListsConfig[sideListParam]) {
            setSideList(sideListParam);
        }
    }, [sideListParam]);

    const handleSideListChange = (key) => {
        setSideList(key);
        setShowSideList(true);
    };

    const renderSideListComponent = () => {
        const SelectedComponent = sideListsConfig[sideList].component;
        return <SelectedComponent setMessages={setMessages} setShowSideList={setShowSideList} />;
    };

    return (
        <div className="p-3 d-flex bg-light-subtle gap-3 vh-100">
            <div className="w-p-9 fs-6 d-flex flex-column justify-content-between text-center">
                <div>
                    {Object.keys(sideListsConfig).map(key => (
                        <SideNavButton
                            key={key}
                            onClick={() => handleSideListChange(key)}
                            active={key === sideList}
                        >
                            {sideListsConfig[key].icon}
                        </SideNavButton>
                    ))}
                </div>
                <div>
                    <Dropdown drop="up">
                        <Dropdown.Toggle 
                            variant="transparent"
                            className="dropdown-icon-none p-1 rounded-circle" 
                        >
                            <Pfp className="fs-4 h-p-7 w-p-7" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow mb-3 py-2 px-1 w-p-65 rounded-3">
                            <DropdownItem 
                                icon={<i className="bi bi-gear-wide"></i>}
                            >
                                Preferences
                            </DropdownItem>
                            <DropdownDivider />
                            <DropdownItem>
                                Info
                            </DropdownItem>
                            <DropdownItem 
                                icon={<i className="bi bi-exclamation-triangle-fill"></i>}
                            >
                                Report a Problem
                            </DropdownItem>
                            <DropdownDivider />
                            <DropdownItem 
                                icon={<i className="bi bi-messenger"></i>}
                                as={Link}
                                to="/desktop"
                            >
                                Try Messenger for {isMac ? 'Mac' : 'Windows'}
                            </DropdownItem>
                            <DropdownItem
                                icon={<i className="bi bi-box-arrow-right ms-1"></i>}
                                as={Link}
                                to="/login" 
                                onClick={logout}
                            >
                                Log Out
                            </DropdownItem>
                            <div className="position-relative">
                                <i class="bi bi-caret-down-fill position-absolute text-white fs-2" style={{ top: '-12px', left: '4px' }}></i>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className={`bg-body p-2 rounded-4 shadow-sm w-md-p-60 d-md-block flex-md-grow-0 flex-grow-1 ${showSideList ? 'd-block' : 'd-none'}`}>
                {renderSideListComponent()}
            </div>
            <div className={`bg-body p-2 rounded-4 shadow-sm flex-grow-1 d-md-block ${showSideList ? 'd-none' : 'd-block'}`}>
                <div>{messages || "No chat selected"}</div>
            </div>
        </div>
    );
};

//#endregion

const Home = () => {
    const auth = useAuth();

    return auth.accessToken ? <PrivateHome auth={auth} /> : (
        <WithNavbar isRoute={false}>
            <PublicHome auth={auth} />
        </WithNavbar>
    );
};

export default Home;