import { Button } from "react-bootstrap";
import Pfp from "./Pfp";

export const ChatSideButton = ({ profile, name, summary, onClick, active }) => {
    return (
        <Button 
            active={active} 
            variant="transparent" 
            className="d-flex align-items-center gap-2 w-100 p-2" 
            onClick={onClick}
        >
            <Pfp src={profile} className="fs-1 h-p-10 w-p-10" />
            <div className="text-start">
                <div className="fs-6 fw-medium">{name}</div>
                <div className="fw-light">{summary}</div>
            </div>
        </Button>
    );
};
