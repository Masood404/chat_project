import classNames from "classnames";
import { Button } from "react-bootstrap";

const IconButton = ({ className="", color="primary", buttonClass="", ...props }) => {
    return (
        <Button 
            variant="transparent" 
            className={classNames('rounded-circle p-1 h-p-8 w-p-8 fs-5', buttonClass)} 
            {...props}>
            <i className={classNames(`text-${color}`, className)}></i>
        </Button>
    );
};

export default IconButton;