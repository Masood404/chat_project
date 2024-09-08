import { FormControl } from 'react-bootstrap';

const Input = ({ className = "", containerClass = "", errors = [], ...props }) => {
    return (
        <div className={`mb-3 ${containerClass}`}>
            <FormControl
                className={`mx-auto py-2 ${className}`}
                {...props}
            />
            {errors.length > 0 && (
                <ul className="list-unstyled">
                    {errors.map((message, i) => (
                        <li key={i} className="d-block invalid-feedback">
                            <div>{message}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Input;