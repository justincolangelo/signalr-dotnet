import type UserMessage from "../components/UserMessage";

export default interface ChatRoomProps {
    connection: signalR.HubConnection;
    username: string;
    typingUsers: Set<string>;
    messages: UserMessage[];
  }