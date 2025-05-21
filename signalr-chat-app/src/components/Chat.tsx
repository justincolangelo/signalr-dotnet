import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { ToastContainer, toast } from "react-toastify";
import "./Chat.css";
import CalculateColor from "../helpers/calculate-color";
import { UserMessage } from "./UserMessage";

const TYPING_TIMEOUT = 3000;

const Chat = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"Disconnected" | "Connecting" | "Connected" | "Reconnecting" | "Failed">("Disconnected");
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = async () => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("/chatHub", {
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

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
        .then(() => {
        console.log("Connected to SignalR.");
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
    connect();
  }, []);

  const sendMessage = async () => {
    if (connection && message && user) {
      try {
        // await connection.invoke("SendMessage", user, message);
        await connection.invoke("SendMessage", message);
        setMessage("");
      } catch (e) {
        toast.error("Message failed.");
        console.error(e);
      }
    }
  };

  const notifyTyping = async () => {
    if (connection && user) {
      try {
        await connection.invoke("UserTyping", user);
      } catch (e) {
        console.error("Typing notification failed", e);
      }
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    notifyTyping();
  };

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

      <input
        type="text"
        placeholder="Name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={handleTyping}
        disabled={status !== "Connected"}
      />
      <button onClick={sendMessage} disabled={status !== "Connected"}>
        Send
      </button>

      {typingUsers.size > 0 && (
        <div style={{ fontStyle: "italic", margin: "0.5rem 0" }}>
            {[...typingUsers].join(", ")} typing <span className="dots">...</span>
        </div>
        )}

<ul>
  {messages.map((msg, idx) => {
    const color = CalculateColor(msg.Username);
    return (
      <li key={idx}>
        <span style={{ color, fontWeight: "bold" }}>{msg.Username}</span>: {msg.Message}
      </li>
    );
  })}
</ul>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Chat;
