import classNames from 'classnames';
import { FormControl } from 'react-bootstrap';

const variantClassMap = {
    "primary": "",
    "secondary": "bg-secondary-subtle border-0 rounded-3"
};

const Input = ({ customVariant = "primary", className = "", containerClass = "", errors = [], ...props }) => {
    return (
        <div className={`mb-3 ${containerClass}`}>
            <FormControl
                className={classNames(
                    'py-2',
                    variantClassMap[customVariant],
                    className
                )}
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