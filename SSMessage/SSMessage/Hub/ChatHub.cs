using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using SSMessage.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SSMessage
{
    //TODO add [Authorize]
    public class ChatHub : Hub
    {
        private readonly static ConnectionMapping _connections = new ConnectionMapping();
        private readonly static Dictionary<string, string> p2pConnections = new Dictionary<string, string>();

        public void Send(string toUserName, string message)
        {
            string fromUserName =  Context.User.Identity.Name;
            if (p2pConnections.ContainsKey(toUserName) && p2pConnections.ContainsValue(fromUserName)
                || p2pConnections.ContainsKey(fromUserName) && p2pConnections.ContainsValue(toUserName))
            {
                string connectionId = _connections.GetConnection(toUserName);

                Clients.Client(connectionId).InvokeAsync("broadcastMessage", fromUserName, message);
            }

        }

        public void ChatRequest(string userNameTo, string rsaPublicKey)
        {
            if (userNameTo != null)
            {
                string fromUserName = Context.User.Identity.Name;
                string connectionId = _connections.GetConnection(userNameTo);

                Clients.Client(connectionId).InvokeAsync("ChatRequest", fromUserName, rsaPublicKey);
            }
        }

        public void ConfirmRequest(string userNameTo, string encryptedAesKey)
        {
            string fromUserName = Context.User.Identity.Name;
            string connectionId = _connections.GetConnection(userNameTo);
            p2pConnections.Add(userNameTo, fromUserName);
            Clients.Client(connectionId).InvokeAsync("ConfirmRequest", fromUserName, encryptedAesKey);
        }

        public void CancelRequest(string userNameTo)
        {
            string fromUserName = Context.User.Identity.Name;
            string connectionId = _connections.GetConnection(userNameTo);

            //TODO change idiotically code sorry for down code i write it in 2:00 AM ;)
            if (p2pConnections.ContainsKey(fromUserName) || p2pConnections.ContainsValue(userNameTo))
            {
                if (p2pConnections.ContainsKey(fromUserName))
                {
                    p2pConnections.Remove(fromUserName);
                }
                if (p2pConnections.ContainsValue(userNameTo))
                {
                    p2pConnections.Remove(p2pConnections.First(kvp => kvp.Value == userNameTo).Key);
                }
            }
            else
            {
                if (p2pConnections.ContainsKey(userNameTo))
                {
                    p2pConnections.Remove(userNameTo);
                }
                if (p2pConnections.ContainsValue(userNameTo))
                {
                    p2pConnections.Remove(p2pConnections.First(kvp => kvp.Value == userNameTo).Key);
                }
            }

            Clients.Client(connectionId).InvokeAsync("CancelRequest");
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

            if (p2pConnections.ContainsKey(name))
            {
                p2pConnections.Remove(name);
            }
            if (p2pConnections.ContainsValue(name))
            {
                p2pConnections.Remove(p2pConnections.First(kvp => kvp.Value == name).Key);
            }

            

            _connections.Remove(name, Context.ConnectionId);

            return Clients.All.InvokeAsync("DisconnectAction", name, Context.ConnectionId);
        }
    }
}