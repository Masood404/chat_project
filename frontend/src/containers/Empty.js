import { Container } from "react-bootstrap";

const Empty = () => {
    return (
        <Container className="h-100 d-flex flex-grow flex-column justify-content-center pb-10 text-center">
            <h2>No chat is selected</h2>
            <div>Create a new chat, or select a chat to display it here.</div>
        </Container>
    );
};

export default Empty;