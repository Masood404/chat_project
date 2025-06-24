import Input from "./Input";

const Search = ({ placeholder='Search', ...props }) => {
    return (
        <div className="d-flex align-items-center bg-body-secondary px-3 mt-2 rounded-5">
            <i className="bi bi-search d-block"></i>
            <Input 
                placeholder={placeholder}
                containerClass="flex-grow-1"
                className="w-100"
                customVariant="none"
                {...props}
            />
        </div>
    );
};

export default Search;