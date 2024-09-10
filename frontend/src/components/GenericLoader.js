import { Spinner } from "react-bootstrap";

const GenericLoader = ({ children }) => {
    return (
        <Spinner variant="grow" role="status">
            <span className="visually-hidden">{children}</span>
        </Spinner>
    );
};

export default GenericLoader;