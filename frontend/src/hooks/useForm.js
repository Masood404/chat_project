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

    const handleChange = ({ target: { type, name, value, checked } }) => {
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
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
        }
    };

    const getInputProps = (name, type = "text") => {
        const inputProps = {
            name,
            placeholder: name[0].toUpperCase() + name.substring(1),
            type,
            errors: formErrors[name],
            onChange: handleChange,
        };

        if (type === "checkbox") {
            return { ...inputProps, checked: !!formData[name] };
        }

        return { ...inputProps, value: formData[name] || "" };
    };

    return { formData, formErrors, handleChange, handleSubmit, getInputProps };
};

export default useForm;