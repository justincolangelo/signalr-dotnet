import { useState } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import type SendMessageFormProps from '../interfaces/SendMessageFormProps';

const SendMessageForm = ({connection, username}: SendMessageFormProps) => {

    const [message, setMessage] = useState('');

    const sendMessage = async (message: string) => {
        if (connection && message && username) {
          try {
            await connection.invoke("SendMessage", username, message);
            setMessage("");
          } catch (e) {
            toast.error("Message failed.");
            console.error(e);
          }
        }
      };
    
      const notifyTyping = async () => {
        if (connection && username) {
          try {
            await connection.invoke("UserTyping", username);
          } catch (e) {
            console.error("Typing notification failed", e);
          }
        }
      };
    
      const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        notifyTyping();
      };

    return <Form onSubmit={e => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
    }}>

        <InputGroup className="mb-3">
            <InputGroup.Text>Message</InputGroup.Text>
            <Form.Control onChange={handleTyping} value={message} placeholder="type message here"></Form.Control>
            <Button variant="primary" type="submit" disabled={!message}>Send</Button>
        </InputGroup>

        <ToastContainer position="bottom-right" />
    </Form>

}

export default SendMessageForm;