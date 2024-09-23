import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

import Button from "../components/Button";

import MessengerStartDownload from "../images/messenger-start-download.svg";
import MessengerDownloadArrow from "../images/messenger-download-arrow.svg";

const StartDownload = () => {
    const isMac = navigator.userAgent.indexOf('Mac OS X') != -1;

    return (
        <div className="wh-100 vh-100 d-flex flex-column">
            <div>
                <div className="d-flex p-2 align-items-end" style={{
                    position: 'absolute',
                    right: '4%'
                }}>
                    <div>Click to install</div>
                    <div><img className="p-3" src={MessengerDownloadArrow} alt="" /></div>
                </div>
            </div>
            <Container fluid className="h-100 p-md-6 p-lg-16">
                <Row className="h-100 align-items-center justify-content-center">
                    <Col className="text-end">
                        <img className="w-xl-90 w-xs-100 object-fit-contain" src={MessengerStartDownload} alt="Messenger Start Download" />
                    </Col>
                    <Col>
                        <h1 className="fs-5 lh-base">Downloading Messenger. Click the installer to finish.</h1>
                        <p className="fw-light">
                            Your download should automatically start, if it doesn't <br />
                            <a 
                                className="fw-normal" 
                                href={`https://www.messenger.com/messenger/desktop/downloadV2/?platform=${isMac ? "mac" : "win"}`}
                            >   
                                click to restart.
                            </a>
                        </p>
                        <div>
                            <Button as={Link}
                                className="fw-normal" 
                                to="/"
                            >   
                                Return to Home
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StartDownload;