import { Button as BsButton } from "react-bootstrap";

const Button = ({ className = "", children, ...props }) => {
    return (
        <BsButton
            className={`rounded-pill py-2 px-3 text-white mb-5 ${className}`}
            {...props}
        >
            {children}
        </BsButton>
    );
};

export default Button;