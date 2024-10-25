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
                            name={chat.name ?? generateUsersString(chat.users, selfId)}
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

function generateUsersString(users, selfId) {
    if (selfId) {
        // Filter out the other users from the users array
        const otherUsers = users.filter(user => user.id !== selfId);

        // If there is only one other user then only return their username
        if (otherUsers.length === 1) return otherUsers[0].username;

        else if (otherUsers.length > 1) {
            // Get all the other usernames
            const usernames = otherUsers.map(user => user.username);
            // The first three users will be displayed as username1, username2, username3
            const displayedUsernames = usernames.slice(0, 3).join(', ');
            // The extra count number if there are more tha three other users
            const extraCount = otherUsers.length - 3;
            
            return extraCount > 0
                // For example, "username1, username2, username3, 2+" would be displayed if there are exacly 5 users
                ? `${displayedUsernames}, ${extraCount}+`
                // For example, "username1, username2, username3" would be displayed if there are exacly 3 users
                : displayedUsernames;
        }
    }

    return 'Empty Chat';
};