import { useState } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';

const SendMessageForm = ({ sendMessage }) => {

    const [message, setMessage] = useState('');

    return <Form onSubmit={e => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
    }}>

        <InputGroup className="mb-3">
            <InputGroup.Text>Message</InputGroup.Text>
            <Form.Control onChange={e => setMessage(e.target.value)} value={message} placeholder="type message here"></Form.Control>
            <Button variant="primary" type="submit" disabled={!message}>Send</Button>
        </InputGroup>

    </Form>

}

export default SendMessageForm;