import classNames from "classnames";

import { Button } from "react-bootstrap";

const ComposeButton = ({ className="", ...props }) => {
    return (
        <Button variant="soft-transparent" className={classNames('rounded-circle', className)} {...props}>
            <i className="bi bi-pencil-square fs-5"></i>
        </Button>
    )
};

export default ComposeButton;