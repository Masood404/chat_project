const NonFieldErrors = ({ non_field_errors = [], className = "", ...props }) => {
    return (
        <>
            {non_field_errors.length > 0 && (
                <ul className={`list-unstyled mb-4 ${className}`} {...props}>
                    {non_field_errors.map((message, i) => (
                        <li key={i} className="d-block invalid-feedback">
                            {message}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default NonFieldErrors;