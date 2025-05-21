import UserMessage from "./UserMessage";
import CalculateColor from "../helpers/calculate-color";
import type UserMessageProps from "../interfaces/UserMessageProps";

const MessageContainer = ({messages}: UserMessageProps) => {

    return <div>
        <ul>
            {messages.map((msg, idx) => {
            const color = CalculateColor(msg.Username);
            return (
                <li key={idx}>
                <span style={{ color, fontWeight: "bold" }}>{msg.Username}</span>: {msg.Message}
                </li>
            );
            })}
            {
                !messages && <h3>There are no messages yet.</h3>
            }
  </ul>
    </div>;

}

export default MessageContainer;