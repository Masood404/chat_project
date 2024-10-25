import classNames from "classnames";

import { DropdownItem as BsDropdownItem } from "react-bootstrap";

const DropdownItem = ({ children, icon, className = "", ...props }) => {
    return (
        <li>
            <BsDropdownItem  {...props} className={classNames(
                "fw-medium d-flex gap-3 p-2 text-decoration-none",
                className
            )}>
                <div className="w-p-6 h-p-6 rounded-circle bg-body-secondary d-flex justify-content-center align-items-center">
                    {icon ? icon : <i className="bi bi-info-circle-fill"></i>}
                </div>
                <div className="flex-grow-1">
                    {children}
                </div>
            </BsDropdownItem>
        </li>
    );
};

export default DropdownItem;