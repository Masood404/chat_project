import { Button } from "react-bootstrap";

const SideNavButton = ({ children, onClick, active = false }) => {
    return (
        <Button className="w-100 px-1 d-block" variant="transparent" size="lg" onClick={onClick} active={active}>
            {children}
        </Button>
    );
};

export default SideNavButton;