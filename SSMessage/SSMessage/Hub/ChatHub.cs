using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using SSMessage.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SSMessage
{
    //TODO add [Authorize]
    public class ChatHub : Hub
    {
        private readonly static ConnectionMapping _connections = new ConnectionMapping();

        public void Send(string toUserName, string message)
        {
            string fromUserName =  Context.User.Identity.Name;
            string connectionId = _connections.GetConnection(toUserName);

            Clients.Client(connectionId).InvokeAsync("broadcastMessage", fromUserName, message);
        }

        public void ChatRequest(string userNameTo)
        {
            string fromUserName = Context.User.Identity.Name;
            string connectionId = _connections.GetConnection(userNameTo);

            Clients.Client(connectionId).InvokeAsync("ChatRequest", fromUserName);
        }

        public void ConfirmRequest(string userNameTo)
        {
            string fromUserName = Context.User.Identity.Name;
            string connectionId = _connections.GetConnection(userNameTo);

            Clients.Client(connectionId).InvokeAsync("ChatRequest", fromUserName);
        }

        public void CancelRequest(string userNameTo)
        {
            string fromUserName = Context.User.Identity.Name;
            string connectionId = _connections.GetConnection(userNameTo);

            Clients.Client(connectionId).InvokeAsync("ChatRequest", fromUserName);
        }

        //TODO move to UserHub.cs
        public override Task OnConnectedAsync()
        {
            string name = Context.User.Identity.Name;

            _connections.Add(name, Context.ConnectionId);
            //Change all connection getting
            return Clients.All.InvokeAsync("ConnectedAction", name, Context.ConnectionId, _connections.GetAllConnections());
        }

        //TODO move to UserHub.cs
        public override Task OnDisconnectedAsync(Exception ex)
        {
            string name = Context.User.Identity.Name;

            _connections.Remove(name, Context.ConnectionId);

            return Clients.All.InvokeAsync("DisconnectAction", name, Context.ConnectionId);
        }
    }
}