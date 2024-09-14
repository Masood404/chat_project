import { useState } from "react";

const useForm = (initial, onSubmit) => {
    const [formData, setFormData] = useState(initial);
    const [formErrors, setFormErrors] = useState({
        non_field_errors: [],
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
            await onSubmit?.(e);
        } catch (error) {
            const data = error.response?.data;

            if (data) {
                const non_field_errors = data.non_field_errors ?? data.detail ? [data.detail] : [];

                setFormErrors({
                    ...data,
                    non_field_errors
                });
            }
            else {
                console.error(error);
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