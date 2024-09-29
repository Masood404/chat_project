import { Button } from "react-bootstrap";
import Pfp from "./Pfp";

export const ChatSideButton = ({ user, onClick, active }) => {
    return (
        <Button 
            active={active} 
            variant="transparent" 
            className="d-flex align-items-center gap-2 w-100 p-2" 
            onClick={onClick}
        >
            <Pfp src={user.profile} className="fs-1 h-p-10 w-p-10" />
            <div className="text-start">
                <div className="fs-6 fw-medium">{user.full_name}</div>
                <div className="fw-light">{user.latest_message}</div>
            </div>
        </Button>
    );
};
