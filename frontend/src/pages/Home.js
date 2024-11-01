import axiosInstance from "../axiosInstance";
import { UnexpectedResponseData } from "../errors";
import { generateUsersString } from "../utils";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form } from "react-bootstrap";

import { useAuth } from "../hooks/AuthProvider";
import useForm from "../hooks/useForm";
import useIsMac from "../hooks/useIsMac";

import MessengerRegister from "../images/messenger-register-image.png";
import AppStore from "../images/app-store.svg";
import MicrosoftStore from "../images/microsoft-store.png";

import Chats from "../components/side-lists/Chats";
import ChatRequests from "../components/side-lists/ChatRequests";
import Archive from "../components/side-lists/Archive";
import Messages from "../containers/Messages";

import WithNavbar from "../routing/WithNavbar";
import Input from "../components/Input";
import Button from "../components/Button";
import NonFieldErrors from "../components/NonFieldErrors";
import SideNavButton from "../components/SideNavButton";
import SettingsButton from "../components/SettingsButton";

const PublicHome = ({ auth }) => {
    const { register, login } = auth;

    const { formErrors, isSubmitting, handleSubmit, getInputProps } = useForm({
        first_name: '',
        last_name: '',
        username: '',
        email_address: '',
        password: '',
        confirmation: ''
    }, register, login);

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
    const { user, accessToken, logout } = auth;
    const navigate = useNavigate();
    const { sideListParam } = useParams();
    const isMac = useIsMac();

    const [chats, setChats] = useState([]);
    const [chatIndex, setChatIndex] = useState(0);

    const [messages, setMessages] = useState([]);

    const [showSideList, setShowSideList] = useState(false);
    const [sideList, setSideList] = useState(sideListParam || 'chats');

    const [main, show] = useState('messages');

    const fetchChats = async () => {
        try {
            const response = await axiosInstance('/chats/');

            if (!response?.data?.results) throw new UnexpectedResponseData(response.data ?? response);

            for (let chat of response.data.results) {
                // Modify the chat name
                chat.name = generateUsersString(chat.users, user.id);
            }

            setChats(response.data.results);
        } catch (error) {
            if (error instanceof UnexpectedResponseData) console.error(error.message);
            else throw error;
        }
    };
    
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
    
    useEffect(() => {
        // Make sure the current user id is fully set
        if (accessToken && user?.id) {
            fetchChats();
        }
    }, [accessToken, user]);

    useEffect(() => {
        setMessages(chats.length > 0 ? chats[chatIndex].admin.full_name : 'No chats found');
    }, [chatIndex]);

    const handleSideListChange = (key) => {
        setSideList(key);
        setShowSideList(true);
        show('messages');
    };

    const handleChatChange = newChatIndex => () => {
        setChatIndex(newChatIndex);
        setShowSideList(false);
        show('messages');
    };  
    const handleComposeClick = () => { show('compose') };

    const sideListsConfig = {
        chats: { icon: <i className="bi bi-chat-fill"></i>, component: <Chats 
            selfId={user?.id} 
            chats={chats} 
            chatIndex={chatIndex} 
            handleChatChange={handleChatChange}
            handleComposeClick={handleComposeClick}
        /> },
        chatRequests: { icon: <i className="bi bi-chat-dots-fill"></i>, component: <ChatRequests /> },
        archive: { icon: <i className="bi bi-archive-fill"></i>, component: <Archive /> }
    };

    const mainConfig = {
        messages: <Messages currentChat={chats[chatIndex]} messages={messages} />,
        compose: (
            <div className="d-flex align-items-center pb-2 px-2 border-bottom">
                <div>To: </div>
                <Input customVariant="none" containerClass="flex-grow-1" className="w-100" />
            </div>
        )
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
                    <SettingsButton logout={logout} isMac={isMac} />
                </div>
            </div>
            <div className={`bg-body rounded-4 shadow-sm w-xl-30 w-md-p-60 d-md-block flex-md-grow-0 flex-grow-1 ${showSideList ? 'd-block' : 'd-none'}`}>
                {sideListsConfig[sideList].component}
            </div>
            <div className={`bg-body rounded-4 shadow-sm flex-grow-1 d-md-block ${showSideList ? 'd-none' : 'd-block'}`}>
                {mainConfig[main]}
            </div>
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