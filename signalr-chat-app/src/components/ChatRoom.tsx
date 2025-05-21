import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import MessageContainer from './MessageContainer';
import SendMessageForm from './SendMessageForm';
import type ChatRoomProps from '../interfaces/ChatRoomProps';

const ChatRoom = ({ connection, username, typingUsers, messages }: ChatRoomProps) => {

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
                <SendMessageForm connection={connection} username={username} />
            </Col>
            <Col sm="12">
                {typingUsers.size > 0 && (
                    <div style={{ fontStyle: "italic", margin: "0.5rem 0" }}>
                        {[...typingUsers].join(", ")} typing <span className="dots">...</span>
                    </div>
                )}
            </Col>
        </Row>
    </div>;

}

export default ChatRoom;