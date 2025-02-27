import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'react-bootstrap';
import { useState } from 'react';
import WaitingRoom from './components/WaitingRoom';
import ChatRoom from './components/ChatRoom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function App() {


    const [conn, setConnection] = useState();
    const [messages, setMessages] = useState([]);

    const joinChatroom = async (username, chatroom) => {
        try {
            const conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5212/chat")
                .configureLogging(LogLevel.Information)
                .build();

            conn.on("JoinChatRoom", (username, message) => {
                console.log(`message: ${message}`);
            });

            conn.on("ReceiveRoomMessage", (username, message) => {
                setMessages(messages => [...messages, { username, message }]);
            });

            await conn.start();
            await conn.invoke("JoinChatRoom", { username, chatroom });

            setConnection(conn);
        }
        catch (ex) {
            console.log(ex);
        }
    }

    const sendMessage = async (message) => {
        try {
            await conn.invoke("SendMessage", message);
        }
        catch (ex) {
            console.log(ex);
        }
    }


    return (
        <div>
            <main>
                <Container>
                    <Row className='px-5 my-5'>
                        <Col sm='12'>
                            <h1>Chat Client</h1>
                        </Col>
                    </Row>
                    {!conn
                        ? <WaitingRoom joinChatroom={joinChatroom}></WaitingRoom>
                        : <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
                    }

                </Container>
            </main>
        </div>
    );
}

export default App;
