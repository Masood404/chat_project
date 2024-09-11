import { Spinner } from "react-bootstrap";

const GenericLoader = ({ children, ...props }) => {
    return (
        <div className="d-flex align-items-center gap-2">
            <Spinner animation="grow" role="status" className="d-inline-block" {...props} />
            {children && (
                <div className="d-inline-block">{children}</div>
            )}
        </div>
    );
};

export default GenericLoader;