import { ChatSideButton } from "../ChatSideButton";
import Input from "../Input";
import Search from "../Search";

const Chats = ({ chats, currentChatIndex, handleChatChange }) => {
    return (
        <div className="h-100 d-flex flex-column pb-3">
            <div className="px-2 py-2 d-flex flex-column">
                <h1 className="fs-4 fw-bold m-2">Chats</h1>
                <Search placeholder="Search Chats" />
            </div>
            <div className="flex-grow-1 scroll-container-wrapper">
                <div className="scroll-container px-2">
                    {chats.map((chat, i) => (
                        <ChatSideButton 
                            key={i}
                            name={chat.name}
                            summary="Dummy Message for now"
                            onClick={handleChatChange(i)} 
                            active={i === currentChatIndex}
                        />))}
                </div>
            </div>
        </div>
    )
}

export default Chats;