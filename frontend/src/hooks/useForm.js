import { useState } from "react";

const useForm = (initial, onSubmit) => {
    const [formData, setFormData] = useState(initial);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = ({ target: { type, name, value, checked } }) => { setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    })); };

    const handleSubmit = e => {
        e.preventDefault();

        try {
            onSubmit?.(e);
        } catch (error) {
            if (error?.response) {
                const non_field_errors = error.response?.details ?? error.response?.non_field_errors;

                setFormErrors({
                    ...error.response,
                    non_field_errors
                });
            }     
            else {
                throw error;
            }       
        }
    };

    const getInputProps = (name, type = "text") => {
        const inputProps = {
          name,
          type,
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