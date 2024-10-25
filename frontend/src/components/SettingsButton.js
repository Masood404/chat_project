import { Link } from "react-router-dom";

import { Dropdown } from "react-bootstrap";
import DropdownItem from "./DropdownItem";
import DropdownDivider from "./DropdownDivider";
import Pfp from "./Pfp";

const SettingsButton = ({ logout, isMac }) => {
    return (
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
                    <i className="bi bi-caret-down-fill position-absolute text-white fs-2" style={{ top: '-12px', left: '4px' }}></i>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SettingsButton;