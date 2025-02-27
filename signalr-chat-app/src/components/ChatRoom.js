import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import MessageContainer from './MessageContainer';
import SendMessageForm from './SendMessageForm';

const ChatRoom = ({ messages, sendMessage }) => {

    return <div>
        <Row className="px-5 my-5">
            <Col sm="10">
                <h2>Chat Room</h2>
            </Col>

            <Col sm="12">

            </Col>
        </Row>
        <Row className="px-5 my-5">
            <Col sm="12">
                <MessageContainer messages={messages} />
            </Col>
            <Col sm="12">
                <SendMessageForm sendMessage={sendMessage} />
            </Col>
        </Row>
    </div>;

}

export default ChatRoom;