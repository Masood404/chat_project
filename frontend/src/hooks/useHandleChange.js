const useHandleChange = setFormData => ({ target: {type, name, value, checked} }) => { setFormData(prev => {
    if (type === 'checkbox') {
        return {
            ...prev,
            [name]: checked
        };
    }

    return {
        ...prev,
        [name]: value
    };

}); };

export default useHandleChange;