import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./components/Chat.css";
import UserMessage from "./components/UserMessage";
import WaitingRoom from "./components/WaitingRoom";
import ChatRoom from "./components/ChatRoom";
import { LogLevel, HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";

const TYPING_TIMEOUT = 3000;

function App() {

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<UserMessage[]>([]);
    const [user, setUser] = useState("");
    const [chatroom, setChatroom] = useState("");
    const [status, setStatus] = useState<"Disconnected" | "Connecting" | "Connected" | "Reconnecting" | "Failed">("Disconnected");
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = async (username: string, chatroom: string) => {
      const newConnection = new HubConnectionBuilder()
        .withUrl("/chatHub", {
          transport: HttpTransportType.WebSockets,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();
  

      newConnection.on("JoinChatRoom", (user: string, message: string) => {
          console.log(`message: ${message}`);
          setMessages(prev => [...prev, new UserMessage(user, message)]);
      });

      newConnection.on("ReceiveMessage", (user: string, message: string) => {
        setMessages(prev => [...prev, new UserMessage(user, message)]);
      });
  
      newConnection.on("ReceiveRoomMessage", (username: string, message: string) => {
          setMessages(messages => [...messages, new UserMessage(username, message)]);
      });
  
      newConnection.on("UserTyping", (typingName: string) => {
          setTypingUsers(prev => {
            const updated = new Set(prev);
            updated.add(typingName);
            return updated;
          });
        
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUsers(new Set());
          }, TYPING_TIMEOUT);
        });
  
      newConnection.onreconnecting(() => {
        setStatus("Reconnecting");
        toast.warn("Reconnecting...");
      });
  
      newConnection.onreconnected(() => {
        setStatus("Connected");
        toast.success("Reconnected!");
      });
  
      newConnection.onclose(() => {
        setStatus("Disconnected");
        toast.error("Connection closed.");
      });
  
      try {
        setStatus("Connecting");
        await newConnection.start()
          .then(async () => {
          console.log("Connected to SignalR.");
          await newConnection.invoke("JoinChatRoom", { username, chatroom });
        });
        setStatus("Connected");
        toast.success("Connected to chat hub.");
        
      } catch (err) {
        setStatus("Failed");
        toast.error("Failed to connect. Retrying...");
        setTimeout(connect, 3000);
      }
  
      setConnection(newConnection);
    };
  
    useEffect(() => {
      //connect();
    }, []);
  
    
  
    const getStatusColor = () => {
      switch (status) {
        case "Connected": return "green";
        case "Connecting": return "orange";
        case "Reconnecting": return "gold";
        case "Disconnected":
        case "Failed": return "red";
      }
    };
  
    return (
      <div className="chat-container">
        <h2>SignalR Chat</h2>
        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: getStatusColor(), fontWeight: "bold" }}>{status}</span>
        </p>

        {!connection
          ? <WaitingRoom 
              joinChatroom={async (user: string, chatroom: string) => { await connect(user, chatroom) }} 
              setUserAndChat={(user: string, chatroom: string) => { setUser(user); setChatroom(chatroom) }}
            ></WaitingRoom>
          : <ChatRoom connection={connection} username={user} typingUsers={typingUsers} messages={messages}></ChatRoom>
        }
  
        <ToastContainer position="bottom-right" />
      </div>
    );
}

export default App;