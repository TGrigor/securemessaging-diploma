var messagingManager = function () {

    var txtMessage;
    var btnSendMessage;
    var messageContent;

    var init = function () {

        txtMessage = $("#txtMessage");
        btnSendMessage = $("#btnSendMessage");
        messageContent = $(".message-content-box");

        load();
    }

    var load = function ()
    {
        //Focus to textarea
        txtMessage.focus();

        // Enter key event for Textarea
        txtMessage.keyup(function (event)
        {
            var code = event.keyCode ? event.keyCode : event.which;
            if (code == 13 && !event.shiftKey)
            {
                addMessage();
            }
        });

        //TODO Change
        // Get the user name and store it to prepend to messages.
        var name = prompt('Enter your name:', '');
        //TODO 

        // Start the connection.
        startConnection('/chat', function (connection)
        {
            // Create a function that the hub can call to broadcast messages.
            connection.on('broadcastMessage', function (name, message)
            {
                // Html encode display name and message.
                txtMessage.val(message);
                addMessage();

                // Add the message to the page.
                var liElement = document.createElement('li');
                liElement.innerHTML = '<strong>' + name + '</strong>:&nbsp;&nbsp;';
                messageContent.append(liElement);
            });
        })
            .then(function (connection)
            {
                console.log('connection started');
                btnSendMessage.on('click', function (event)
                {
                    // Call the Send method on the hub.
                    connection.invoke('send', name, txtMessage.val());

                    // Clear text box and reset focus for next comment.
                    txtMessage.val("");
                    txtMessage.focus();
                    event.preventDefault();
                });
            })
            .catch(error =>
            {
                console.error(error.message);
            });
    }

    var addMessage = function ()
    {
        var messageText = txtMessage.val();
        if (messageText != '') {
            var messageBox = messageTemplate(messageText);
            //txtMessage.val('');
            messageContent.append(messageBox);
        }
        //Scroll To message
        messageContent.animate({ scrollTop: messageContent.prop("scrollHeight") }, 100);
    }

    var messageTemplate = function (message)
    {

        message = message.replace(/.{10}\S*\s+/g, "$&@").split(/\s+@/)

        var template = "<div class=\"dvMessage\">";
        $.each(message, function (index, value)
        {
            template += "<span class=\"spnMessage\">";
            template += value;
            template += "</span>";
        });
        template += "</div>";
        return template;

    }

    var startConnection = function (url, configureConnection)
    {
        return function start(transport)
        {
            console.log(`Starting connection using ${signalR.TransportType[transport]} transport`)

            var connection = new signalR.HubConnection(url, { transport: transport });

            if (configureConnection && typeof configureConnection === 'function')
            {
                configureConnection(connection);
            }

            return connection.start()
                .then(function ()
                {
                    return connection;
                })
                .catch(function (error)
                {
                    console.log(`Cannot start the connection use ${signalR.TransportType[transport]} transport. ${error.message}`);

                    if (transport !== signalR.TransportType.LongPolling)
                    {
                        return start(transport + 1);
                    }

                    return Promise.reject(error);
                });
        }(signalR.TransportType.WebSockets);
    }

    return {
        init: init,
        addMessage: addMessage
    }
}();