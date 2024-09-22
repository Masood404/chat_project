import { Col, Container, Row } from "react-bootstrap";

import FeaturesImage from "../images/messenger-features-image.png";
import VideoFeaturePoster from "../images/messenger-video-feature-poster.png";
import EmojiFeaturePoster from "../images/messenger-emoji-feature-poster.png";
import RepliesFeature from "../images/messenger-replies-feature.png";

import VideoFeature from "../videos/messenger-video-feature.mp4";
import EmojiFeature from "../videos/messenger-emoji-feature.mp4";

const Features = () => {
    return (
        <Container fluid className="gap-2">
            <Row className="text-center pb-10 px-4 px-xxl-10">
                <Col lg={5} xs={12} className="text-lg-start">
                    <h1 className="theme-gradient-horizontal fs-0 lh-1 ls-2 mb-4">
                        More ways <br />
                        to stay connected
                    </h1>
                    <p className="fw-normal mb-5">
                        Messenger has everything you need to feel
                        <br />
                        closer to your favorite people.
                    </p>
                </Col>
                <Col
                    lg={7}
                    xs={12}
                    className="d-flex justify-content-center
                        justify-content-lg-end"
                >
                    <div>
                        <div className="w-xs-150 w-lg-90 ms-lg-auto position-relative start-50 top-50 translate-middle">
                            <img className="w-100 h-auto" src={FeaturesImage} alt="Features Image" />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="py-10 px-4 px-xxl-10 bg-lavender-mist">
                <Col
                    xs={12}
                    md={6}
                    className="px-lg-5 px-xl-7 px-2 px-md-4"
                >
                    <h3 className="fs-6 mb-3 text-body-tertiary">WATCH TOGETHER</h3>
                    <h2 className="fs-c1 fw-medium mb-3">Enjoy videos with your friends</h2>
                    <p>
                        Watch movies, music videos, TV shows and more with your friends over video chat.
                    </p>

                </Col>
                <Col xs={12} md={6}>
                    <video
                        className='w-100 d-block'
                        poster={VideoFeaturePoster}
                        src={VideoFeature}
                        autoPlay
                        muted
                        loop
                    ></video>
                </Col>
            </Row>
            <Row className="py-10 px-4 px-xxl-10 align-items-center">
                <Col xs={12} md={6} className="order-last order-md-first px-8 px-md-6 px-lg-8">
                    <video
                        className='w-100 d-block'
                        poster={EmojiFeaturePoster}
                        src={EmojiFeature}
                        autoPlay
                        muted
                        loop
                    ></video>
                </Col>
                <Col
                    xs={12}
                    md={6}
                    className="px-lg-5 px-xl-7 px-2 px-md-4"
                >
                    <h3 className="fs-6 mb-3 text-body-tertiary">CUSTOM REACTIONS</h3>
                    <h2 className="fs-c1 fw-medium mb-3">Say it with any emoji</h2>
                    <p>
                        Lost for words? Now you can customize your reactions, with way more emojis to choose from, including 🎉 and 🔥.
                    </p>

                </Col>
            </Row>
            <Row className="py-10 px-4 px-xxl-10 bg-lavender-mist">
                <Col
                    xs={12}
                    md={6}
                    className="px-lg-5 px-xl-7 px-2 px-md-4"
                >
                    <h3 className="fs-6 mb-3 text-body-tertiary">REPLIES & FORWARDING</h3>
                    <h2 className="fs-c1 fw-medium mb-3">Let the conversation flow</h2>
                    <p>
                        Choose the exact message you want to reply to or forward, right in your chat.
                    </p>

                </Col>
                <Col xs={12} md={6}>
                    <img className="w-100" src={RepliesFeature} alt="Replies and Forwarding Feature" />
                </Col>
            </Row>
        </Container>
    );
};

export default Features;