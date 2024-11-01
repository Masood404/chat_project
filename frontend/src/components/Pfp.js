import classNames from "classnames";

const Pfp = ({ src, className, size="sm" }) => {
    const sizeMap = {
        sm: "fs-4 h-p-7 w-p-7",
        md: "fs-2 h-p-8 w-p-8",
        lg: "fs-1 h-p-10 w-p-10"
    };

    return (
        <div className={classNames(
            'rounded-circle border border-secondary-subtle',
            'bg-body-secondary overflow-hidden',
            'd-flex flex-column justify-content-center text-center',
            sizeMap[size],
            className
        )}>
            {src ? (
                <img src={src} alt="Profile" />
            ) : (
                <i className="i bi-person-fill"></i>
            )}
        </div>
    );
}

export default Pfp;