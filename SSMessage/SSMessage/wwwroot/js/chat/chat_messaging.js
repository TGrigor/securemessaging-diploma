var messageType = {
    Outgoing : 0,
    Incoming : 1
}

var messagingManager = function () {

    var txtMessage;
    var btnSendMessage;
    var messageContent;
    var currentUserName;

    var init = function (userName) {

        txtMessage = $("#txtMessage");
        btnSendMessage = $("#btnSendMessage");
        messageContent = $(".message-content-box");

        this.currentUserName = userName;
        load();
    }

    var load = function () {
        //Focus to textarea
        txtMessage.focus();

        // Enter key event for Textarea
        txtMessage.keyup(function (event) {
            var code = event.keyCode ? event.keyCode : event.which;
            if (code === 13 && !event.shiftKey) {
                addMessage(messageType.Outgoing);
                btnSendMessage.click();
            }
        });

        // Start the connection.
        startConnection('/chat', function (connection) {
            // Create a function that the hub can call to broadcast messages.
            connection.on('broadcastMessage', function (fromUserName, message) {
                // Html encode display name and message.
                txtMessage.val(message);
                addMessage(messageType.Incoming);

                // Add the message to the page.
                //var liElement = document.createElement('li');
                //liElement.innerHTML = '<strong>' + fromUserName + '</strong>:&nbsp;&nbsp;';
                //messageContent.append(liElement);
                deleteMeesageBox();
            });
        })
            .then(function (connection) {
                console.log('connection started');
                btnSendMessage.on('click', function (event) {
                    // Call the Send method on the hub.
                    connection.invoke('send', userManager.getSendToUserName(), txtMessage.val());

                    deleteMeesageBox();
                    event.preventDefault();
                });
            })
            .catch(error => {
                console.error(error.message);
            });
    }

    var addMessage = function (mType) {
        var messageText = txtMessage.val();
        if (messageText !== '') {
            var messageBox = messageTemplate(messageText, mType);
            messageContent.append(messageBox);
        }
        //Scroll To message
        messageContent.animate({ scrollTop: messageContent.prop("scrollHeight") }, 100);
    }

    var deleteMeesageBox = function () {
        // Clear text box and reset focus for next comment.
        txtMessage.val("");
        txtMessage.focus();
    }

    var messageTemplate = function (message, mType)
    {
        message = message.replace(/.{10}\S*\s+/g, "$&@").split(/\s+@/)
        var template = "";
        switch (mType)
        {
            case messageType.Incoming:
                template = "<div class=\"dvIncomingMessage\">";
                break;
            case messageType.Outgoing:
                template = "<div class=\"dvOutgoingMessage\">";
                break;
        }

        $.each(message, function (index, value) {
            template += "<span class=\"spnMessage\">";
            template += value;
            template += "</span>";
        });
        template += "</div>";
        return template;
    }

    var startConnection = function (url, configureConnection) {
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
        addMessage: addMessage
    }
}();