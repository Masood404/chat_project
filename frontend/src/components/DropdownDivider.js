import classNames from "classnames";

import { DropdownDivider as BsDropdownDivider } from "react-bootstrap";

const DropdownDivider = ({ className="", ...props }) => {
    return <BsDropdownDivider className={classNames('mx-2', className)} {...props} />
};

export default DropdownDivider;