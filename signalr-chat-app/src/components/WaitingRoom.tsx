import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import type WaitingRoomProps from '../interfaces/WaitingRoomProps';

const WaitingRoom = ({joinChatroom, setUserAndChat}: WaitingRoomProps) => {

    const [user, setUsername] = useState();
    const [chatRoom, setChatroom] = useState();

    return <Form onSubmit={async (e: any) => {
            e.preventDefault();
            setUserAndChat(user, chatRoom);
            await joinChatroom(user, chatRoom);
        }
    }>

        <Row className="px-5 my-5">
            <Col sm="12">
                <Form.Group>
                    <Form.Control placeholder="username" onChange={(e: any) => setUsername(e.target.value)}></Form.Control>
                    <Form.Control placeholder="chat room" onChange={(e: any) => setChatroom(e.target.value)}></Form.Control>
                </Form.Group>
            </Col>

            <Col sm="12">
                <hr />
                <Button variant="success" type="submit">Join</Button>
            </Col>
        </Row>

    </Form>

}

export default WaitingRoom;