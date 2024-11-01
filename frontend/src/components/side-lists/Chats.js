import { ChatSideButton } from "../ChatSideButton";
import ComposeButton from "../ComposeButton";
import Input from "../Input";

const Chats = ({ selfId, chats, currentChatIndex, handleChatChange, handleComposeClick }) => {
    return (
        <div className="h-100 d-flex flex-column pb-3">
            <div className="px-2 py-2 d-flex flex-column">
                <div className="d-flex align-items-center">
                    <h1 className="fs-4 fw-bold m-0 ms-2 flex-grow-1">Chats</h1>
                    <div><ComposeButton onClick={handleComposeClick} /></div>
                </div>
                <div className="d-flex align-items-center bg-body-secondary px-3 mt-2 rounded-5">
                    <i className="bi bi-search d-block"></i>
                    <Input 
                        placeholder="Search messenger"
                        containerClass="flex-grow-1"
                        className="w-100"
                        customVariant="none"
                    />
                </div>
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