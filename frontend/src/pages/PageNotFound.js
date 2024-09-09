import { Link } from 'react-router-dom';

import MessengerLogo from '../images/messenger-logo.svg';

import Button from '../components/Button';

const PageNotFound = () => {
    return (
        <div className="h-100 d-flex justify-content-center align-items-center flex-column text-center">
            <div className="mb-5">
                <img src={MessengerLogo} id="messenger-logo" alt="Messenger Logo" style={{
                    width: 120
                }} />
            </div>
            <div className="fs-1 mb-2 fw-medium">This Page isn't available</div>
            <div className="fs-5 mb-5">The link that you followed may be broken or the Page may have been removed.</div>
            <div>
                <Button as={Link} to="/">Return messenger clone</Button>
            </div>
        </div>
    );
};

export default PageNotFound;