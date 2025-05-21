export default class UserMessage {
    public Username: string;
    public Message: string;

    constructor(username: string, message: string) {
        this.Username = username;
        this.Message = message;
      }
}