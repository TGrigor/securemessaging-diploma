using System.Collections.Generic;
using System.Linq;

namespace SSMessage
{
    public class ConnectionMapping
    {
        private readonly Dictionary<string, string> _connections = new Dictionary<string, string>();

        public int Count
        {
            get
            {
                return _connections.Count;
            }
        }

        public void Add(string key, string connectionId)
        {
            lock (_connections)
            {
                _connections.Add(key, connectionId);
            }
        }

        public string GetConnection(string key)
        {
            string connections;
            if (_connections.TryGetValue(key, out connections))
            {
                return connections;
            }

            return string.Empty;
        }
        
        public void Remove(string key, string connectionId)
        {
            lock (_connections)
            {
                string connections;

                if (!_connections.TryGetValue(key, out connections))
                {
                    return;
                }

                lock (connections)
                {
                    _connections.Remove(key);
                }
            }
        }

        public Dictionary<string, string> GetAllConnections()
        {
            return _connections;
        }
    }
}