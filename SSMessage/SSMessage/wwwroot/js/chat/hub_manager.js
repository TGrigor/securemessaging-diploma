var hubManager = function ()
{
    var init = function ()
    {
        load();
    }

    var load = function ()
    {
        
    }

    var startConnection = function (url, configureConnection)
    {
        return function start(transport) {
            console.log(`Starting connection using ${signalR.TransportType[transport]} transport`)

            var connection = new signalR.HubConnection(url, { transport: transport });

            if (configureConnection && typeof configureConnection === 'function') {
                configureConnection(connection);
            }

            return connection.start()
                .then(function () {
                    return connection;
                })
                .catch(function (error) {
                    console.log(`Cannot start the connection use ${signalR.TransportType[transport]} transport. ${error.message}`);

                    if (transport !== signalR.TransportType.LongPolling) {
                        return start(transport + 1);
                    }

                    return Promise.reject(error);
                });
        }(signalR.TransportType.WebSockets);
    }

    return {
        init: init,
        startConnection: startConnection
    }
}();