import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const WaitingRoom = ({ joinChatroom }) => {

    const [user, setUsername] = useState();
    const [chatRoom, setChatroom] = useState();


    return <Form onSubmit={e => {
        e.preventDefault();
        joinChatroom(user, chatRoom);
        }
    }>

        <Row className="px-5 my-5">
            <Col sm="12">
                <Form.Group>
                    <Form.Control placeholder="username" onChange={e => setUsername(e.target.value)}></Form.Control>
                    <Form.Control placeholder="chat room" onChange={e => setChatroom(e.target.value)}></Form.Control>
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