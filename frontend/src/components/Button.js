import { Button as BsButton } from "react-bootstrap";

import GenericLoader from "./GenericLoader";

const Button = ({ submittingText = "", isSubmitting = false, className = "", children, ...props }) => {
    return (
        <BsButton
            className={`fw-medium rounded-pill text-white mb-5 ${className}`}
            style={{
                padding: "12px 24px"
            }}
            {...props}
        >
            {isSubmitting ? (
                <GenericLoader size="sm" >{submittingText}</GenericLoader>
            ) : children}
        </BsButton>
    );
};

export default Button;