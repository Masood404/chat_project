import { useEffect, useState } from "react";
import { ChatSideButton } from "../../components/Chat";

const users = [
    {
        full_name: "Dummy user 1",
        profile: null,
        latest_message: "Hello"
    },
    {
        full_name: "Dummy user 2",
        profile: null,
        latest_message: "World"
    },
    {
        full_name: "Dummy user 3",
        profile: null,
        latest_message: "And Mars"
    }
];

const Chats = ({ setMessages, setShowSideList }) => {
    const [currentChat, setCurrentChat] = useState(0);

    useEffect(() => {
        setMessages([users[currentChat].latest_message]);
    }, [currentChat]);

    return (
        <div>
            {users.map((user, i) => (
                <ChatSideButton 
                    key={i}
                    user={user} 
                    onClick={() => {
                        setCurrentChat(i);
                        setShowSideList(false);
                    }} 
                    active={i === currentChat}
                />))}
        </div>
    )
}

export default Chats;