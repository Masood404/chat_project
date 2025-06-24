import { Button, Container, Form } from "react-bootstrap";

import useForm from "../hooks/useForm";

import Pfp from "../components/Pfp";
import Input from "../components/Input";
import IconButton from "../components/IconButton";

const Messages = ({ currentChat, messages }) => {
    const { formData, handleChange } = useForm({
        message: ""
    });

    const handleInput = ({ target }) => {
        // Reset the rows for (re)-calculation
        target.setAttribute('rows', 1);

        // Get line height, assuming 20px as a default
        const lht = parseInt(window.getComputedStyle(target).lineHeight, 10);
        // Calculate the lines
        let lines = Math.floor(target.scrollHeight / lht);
        // Restrict the lines no greater than 5
        if (lines > 6) lines = 6;

        target.setAttribute('rows', lines);
    };

    // Either to show the composer's input icons such as image uploader, gif sender, etc.
    const showInputIcons = !formData?.message;
    // The transition time for the width for the composer's icon input's container (In seconds)
    const inputTransition = 0.3;
    // The transition time for each input icon's size (In seconds)
    let inputIconTransition = inputTransition;

    // Check if any chat is being currently selected then display that, if not show a message stating no chat is selected.
    return currentChat ? (
        <div className="h-100 d-flex flex-column">
            <div className="d-flex align-items-center p-2 border-bottom border-3">
                <div className="flex-grow-1 d-flex justify-content-start">
                    <Button variant="transparent" className="d-flex gap-2 align-items-center ps-1 p-2 rounded-4 text-start">
                        <Pfp size="md" />
                        <div>
                            <div className="fw-6 fw-semibold">
                                {currentChat?.name}
                            </div>
                            <div className="fs-7">Active (TODO) ago</div>
                        </div>
                    </Button>
                </div>
                <div className="d-flex justify-content-center align-items-center gap-2">
                    {['bi bi-telephone-fill', 'bi bi-camera-video-fill', 'bi bi-three-dots']
                        .map((className, i) => (
                            <IconButton key={i} color="violet" className={className} />
                        ))}
                </div>
            </div>
            <div className="flex-grow-1">
                {messages}
            </div>
            <Form className="p-2 d-flex align-items-center">
                <IconButton color="primary" className="bi bi-plus-circle-fill" />
                <div className="position-relative" style={{
                    maxWidth: showInputIcons ? 120: 0,
                    transitionProperty: 'max-width',
                    transitionDuration: `${inputTransition}s`,
                    whiteSpace: 'nowrap'
                }}>
                    {['bi bi-image', 'bi bi-sticky-fill', 'bi bi-filetype-gif'].map((className, i) => {
                        const iconButton = (
                            <IconButton 
                                key={i} 
                                color="primary" 
                                className={className}
                                style={{
                                    visibility: showInputIcons ? 'visible' : 'hidden',
                                    transform: showInputIcons ? 'scale(1)' : 'scale(0)',
                                    transitionProperty: 'transform, visibility',
                                    transitionDuration: `${inputIconTransition}s`,
                                    transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                                }} 
                            />
                        );
                        
                        /* The following statements will give the effect like whenever the main message composer touches the
                        input icons when it collapses them, the righter most icons will collapse faster than those of left,
                        and when it is about to un-collapse those input icons, the left one will show up first and the righter most
                        ones are gonna show up as the main message composer gets reduced in width. */

                        // If the input icons are about to be showed, increase the transition time of icons from left by 10% proporionally
                        if (showInputIcons) inputIconTransition += inputIconTransition * 0.1;
                        // If the the input icons are about to be hidden, decrease the transition time from left by 40% proportionally
                        else inputIconTransition -= inputIconTransition * 0.4;

                        return iconButton;
                    })}
                </div>
                
                <div className="flex-grow-1 d-flex bg-body-secondary mx-2 rounded-5 ps-3">
                    <Input 
                        placeholder="Aa"
                        containerClass="flex-grow-1 align-self-center py-2"
                        className="w-100 fs-7 p-0 py-1"
                        customVariant="none"
                        as="textarea"
                        onInput={handleInput}
                        onChange={handleChange}
                        rows="1"
                        style={{
                            minHeight: 0,
                            resize: "none",
                            caretColor: 'var(--bs-primary)'
                        }}
                        name="message"
                        value={formData.message}
                    />
                    <IconButton buttonClass="align-self-end" className="bi bi-emoji-smile-fill" />
                </div>
                {formData.message ? (
                    <IconButton type="submit" className="bi bi-send-fill" />
                ) : (
                    <IconButton className="bi bi-hand-thumbs-up-fill" />
                )}
            </Form>
        </div>
    ) : (
        <Container className="h-100 d-flex flex-grow flex-column justify-content-center pb-10 text-center">
            <h2>No chat is selected</h2>
            <div>Create a new chat, or select a chat to display it here.</div>
        </Container>
    )
};

export default Messages;