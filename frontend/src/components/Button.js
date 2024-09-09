import { Button as BsButton } from "react-bootstrap";

const Button = ({ className = "", children, ...props }) => {
    return (
        <BsButton
            className={`fw-medium rounded-pill text-white mb-5 ${className}`}
            style={{
                padding: "15px 30px"
            }}
            {...props}
        >
            {children}
        </BsButton>
    );
};

export default Button;