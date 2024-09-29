import classNames from "classnames";

const Pfp = ({ src, className }) => {
    return (
        <div className={classNames(
            'rounded-circle border border-secondary-subtle',
            'bg-body-secondary overflow-hidden',
            'd-flex flex-column justify-content-center',
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