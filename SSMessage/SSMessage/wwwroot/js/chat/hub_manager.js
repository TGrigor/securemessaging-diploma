var hubManager = function ()
{
    var connectionObject;

    //Events
    var init = function ()
    {
        load();
    }
    var load = function ()
    {
        // Start the connection.
        startConnection('/chat', function (connection)
        {
            // Create a function that the hub can call to broadcast messages.
            connection.on('broadcastMessage', function (fromUserName, message)
            {
                var decryptedMessage = aesManager.decrypt(message);

                // Html encode display name and message.
                messagingManager.addMessage(decryptedMessage, messageType.Incoming);

                messagingManager.deleteMeesageBox();
            });
            connection.on('ChatRequest', function (fromUserName)
            {
                aesManager.setKey(prompt("Please enter Key for start new encrypted tunnel!"));
                userManager.setSendToUserName(fromUserName);
            });

            //TODO move to user-manager.js and corrected code
            connection.on('ConnectedAction', function (connectedUserName, connectedUserId, allConnectedUsers)
            {
                userManager.removeUsers()
                var currentUserName = userManager.getCurrentUserName();

                //TODO: refactoring and optimisation
                $.each(allConnectedUsers, function (key, value)
                {
                    if (key !== currentUserName)
                    {
                        userManager.addNewUser(key, value, actionType.Online);
                    }
                });

                if (connectedUserName === currentUserName)
                {
                    return;
                }
                else
                {
                    console.log(connectedUserName + "---- Connected");
                    //TODO after added new function for gettiing all users uncomment this field
                    //userManager.addNewUser(connectedUserName, connectedUserId, actionType.Online);
                }
            });

            connection.on('DisconnectAction', function (disconnectedUserName, disconnectedUserId)
            {
                if (disconnectedUserName === userManager.getCurrentUserName())
                {

                }
                else
                {
                    console.log(disconnectedUserName + "---- Disconnected");
                    userManager.removeUserById(disconnectedUserId);
                }
            });
        })
        .then(function (connection)
        {
            console.log('connection started');
            connectionObject = connection;
        })
        .catch(error =>
        {
            console.error(error.message);
        });
    }

    //Methods
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
    var getConnection = () => {
        return connectionObject;
    }

    return {
        init: init,
        getConnection: getConnection
    }
}();