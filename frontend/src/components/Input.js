import classNames from 'classnames';
import { FormControl } from 'react-bootstrap';

const variantClassMap = {
    "primary": "",
    "secondary": "bg-light-subtle border-0 rounded-3",
    "none": "border-0 shadow-none bg-transparent"
};

const Input = ({ customVariant = "primary", className = "", containerClass = "mb-3", errors = [], ...props }) => {
    return (
        <div className={containerClass}>
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