using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using SSMessage.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SSMessage
{
    public class ChatHub : Hub
    {
        private readonly static ConnectionMapping<string> _connections =
          new ConnectionMapping<string>();

        public void Send(string toUserName,string connectionId, string message)
        {

            string fromUserName = Context.User.Identity.Name;

            Clients.Client(connectionId).InvokeAsync("broadcastMessage", fromUserName, message);
        }

        public override Task OnConnectedAsync()
        {
            string name = Context.User.Identity.Name;

            _connections.Add(name, Context.ConnectionId);

           return Clients.All.InvokeAsync("ConnectedAction", name, Context.ConnectionId);

        }

        public override Task OnDisconnectedAsync(Exception ex)
        {
            string name = Context.User.Identity.Name;

            _connections.Remove(name, Context.ConnectionId);

            return Clients.All.InvokeAsync("DisconnectAction", name, Context.ConnectionId);
        }
    }
}