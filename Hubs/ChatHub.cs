using Microsoft.AspNetCore.SignalR;
using SignalRChat.DataService;
using SignalRChat.Models;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        private const string RECEIVEMESSAGE = "ReceiveMessage";
        private const string RECEIVEROOMMESSAGE = "ReceiveRoomMessage";
        private readonly SharedDb _sharedDb;

        public ChatHub(SharedDb sharedDb)
        {
            _sharedDb = sharedDb;
        }

        public async Task JoinChat(UserConnection connection)
        {
            await Clients.All.SendAsync(RECEIVEMESSAGE, "admin", $"{connection.Username} joined.");
        }

        public async Task JoinChatRoom(UserConnection connection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, connection.ChatRoom);

            _sharedDb.connections[Context.ConnectionId] = connection;

            await Clients.Group(connection.ChatRoom).SendAsync(RECEIVEROOMMESSAGE, "admin", $"{connection.Username} joined {connection.ChatRoom}.");
        }

        public async Task SendMessage(string message)
        {
            if (_sharedDb.connections.TryGetValue(Context.ConnectionId, out UserConnection connection)) {
                await Clients.Group(connection.ChatRoom).SendAsync(RECEIVEROOMMESSAGE, connection.Username, message);
            }
        }

    }
}
