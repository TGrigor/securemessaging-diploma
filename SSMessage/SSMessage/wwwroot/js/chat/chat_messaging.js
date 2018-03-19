var messageType = {
    Outgoing: 0,
    Incoming: 1
}

var messagingManager = function () {

    var inputMessage;
    var btnSendMessage;
    var currentUserName = "";
    var message_side = 'left';
    var test;

    var init = function (userName) {
        currentUserName = userName;
        inputMessage = $("#inputMessage");
        btnSendMessage = $("#btnSendMessage");

        load();
    }

    var load = function () {
        //Focus to textarea
        inputMessage.focus();

        btnSendMessage.click(function (e) {
            return addMessage(getMessageText(), messageType.Outgoing);
        });

        // Enter key event for input
        inputMessage.keyup(function (e) {
            if (e.which === 13 && !e.shiftKey) {
                // enter key
                var code = e.keyCode ? e.keyCode : e.which;
                btnSendMessage.click();
                return addMessage(getMessageText(), messageType.Outgoing);
            }
        });

        // Start the connection.
        startConnection('/chat', function (connection) {
            // Create a function that the hub can call to broadcast messages.
            connection.on('broadcastMessage', function (fromUserName, message) {
                // Html encode display name and message.
                addMessage(message, messageType.Incoming);
                deleteMeesageBox();
            });

            connection.on('ConnectedAction', function (connectedUserName, connectedUserId) {
                if (connectedUserName === currentUserName)
                {
                    return;
                }
                else
                {
                    console.log(connectedUserName + "---- Connected");
                }
            });

            connection.on('DisconnectAction', function (disconnectedUserName, disconnectedUserId) {
                if (disconnectedUserName === currentUserName) {

                }
                else {
                    console.log(disconnectedUserName + "---- Disconnected");
                }
            });
        })
            .then(function (connection) {
                console.log('connection started');
                btnSendMessage.on('click', function (event) {
                    // Call the Send method on the hub.
                    connection.invoke('send', userManager.getSendToUserName(), inputMessage.val());

                    deleteMeesageBox();
                    event.preventDefault();
                });
            })
            .catch(error => {
                console.error(error.message);
            });
    }

    //Message class Template
    var Message = function ({ text: text1, message_side: message_side1 }) {
        this.text = text1;
        this.message_side = message_side1;
        this.draw = () => {
            var $message;

            $message = $($('.message_template').clone().html());

            $message.addClass(this.message_side).find('.text').html(this.text);

            $('.messages').append($message);

            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        };
        return this;
    }

    var getMessageText = function () {
        return inputMessage.val();
    }

    var addMessage = function (text, mType) {
        var $messages, message;
        //RegX
        //text = text.replace(/.{10}\S*\s+/g, "$&@").split(/\s+@/)

        if (text.trim() === '') {
            return;
        }
        $messages = $('.messages');

        switch (mType) {
            case messageType.Incoming:
                message_side = 'right';
                break;
            case messageType.Outgoing:
                message_side = 'left';
                break;
        }

        message = new Message({ text, message_side });
        message.draw();

        return $messages.animate({
            scrollTop: $messages.prop('scrollHeight')
        }, 300);
    }

    var deleteMeesageBox = function () {
        // Clear text box and reset focus for next comment.
        inputMessage.val("");
        inputMessage.focus();
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
        init: init
    }
}();