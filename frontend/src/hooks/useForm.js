import { useState } from "react";

/* Difference between onSubmit and success is that onSubmit's errors will be used to render field errors or invalidity, 
whereas onSuccess just runs after submit */
const useForm = (initial, onSubmit, onSuccess) => {
    const [formData, setFormData] = useState(initial);
    const [formErrors, setFormErrors] = useState({
        non_field_errors: [],
        // Extract the keys from the "intial" variable and intially give their value as an empty array(as of no errors yet)
        ...Object.keys(initial).reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {})
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = ({ target: { type, name, value, checked } }) => {
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Here onSubmit will be intercepted for any possible field errors whereas onSucess is responsible for its own errors
            await onSubmit?.(formData, e);
            onSuccess?.(formData, e);
        } catch (error) {
            const data = error.response?.data;

            if (data) {
                // Try to extract non_field_errors from the response and if not available, try to extract any detail from the response
                const non_field_errors = data.non_field_errors ?? data.detail ? [data.detail] : [];

                setFormErrors({
                    ...data,
                    non_field_errors
                });
            }
            else {
                throw error;
            }
        } finally { setIsSubmitting(false); }
    };

    const getInputProps = (name, type = "text") => {
        // Convert all underscores to empty space
        let placeholder = name.replace(/_/g, ' ');

        // Capitalize the first letter
        placeholder = placeholder[0].toUpperCase() + placeholder.substring(1)

        const inputProps = {
            name,
            placeholder,
            type,
            errors: formErrors[name],
            onChange: handleChange,
        };

        if (type === "checkbox") {
            return { ...inputProps, checked: !!formData[name] };
        }

        return { ...inputProps, value: formData[name] || "" };
    };

    return { formData, formErrors, isSubmitting, handleChange, handleSubmit, getInputProps };
};

export default useForm;