import axiosInstance from "../axiosInstance";

import { useNavigate } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";

import Button from "../components/Button";

import DownloadMessenger from "../images/download-messenger.png";

const DesktopApp = () => {
    const navigate = useNavigate();

    const isMac = navigator.userAgent.indexOf('Mac OS X') != -1;

    return (
        <Container fluid className="px-4 px-xxl-10">
            <Row className="align-items-center text-center text-xl-start">
                <Col xs={12} xl={6}>
                    <h1 className="theme-gradient-horizontal fs-0 lh-1 ls-2 mb-4">
                        Go big with Messenger
                    </h1>
                    <p>
                        A simple app that lets you text, video call, and stay close to people you care about. For Mac and PC.
                    </p>
                    <Button
                        onClick={() => {
                            document.getElementById('hidden-download').click();
                            navigate("/desktop/start-download");
                        }}
                    >
                        {isMac ? 'Download for Mac' : 'Download for Windows'}
                    </Button>

                    <a
                        id="hidden-download"
                        className="d-none"
                        href={`https://www.messenger.com/messenger/desktop/downloadV2/?platform=${isMac ? "mac" : "win"}`}
                    ></a>

                </Col>
                <Col xs={12} xl={6}>
                    <img className="w-xl-130 w-xs-100" src={DownloadMessenger} alt="Download Messenger" />
                </Col>
            </Row>
        </Container>
    );
};

export default DesktopApp;