var messageType = {
    Outgoing: 0,
    Incoming: 1
}

var messagingManager = function () {

    var inputMessage;
    var btnSendMessage;
    //TODO move to user-manager.js
    var currentUserName = "";
    var message_side = 'left';

    var init = function (userName)
    {
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
        hubManager.startConnection('/chat', function (connection)
        {
            // Create a function that the hub can call to broadcast messages.
            connection.on('broadcastMessage', function (fromUserName, message)
            {
                var decryptedMessage = aesManager.decrypt(message);
                // Html encode display name and message.
                addMessage(decryptedMessage, messageType.Incoming);
                deleteMeesageBox();
            });        
            //TODO move to user-manager.js and corrected code
            connection.on('ConnectedAction', function (connectedUserName, connectedUserId, allConnectedUsers)
            {
                var existingUsers = $(".user");
                existingUsers.remove();

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
                if (disconnectedUserName === currentUserName)
                {

                }
                else
                {
                    console.log(disconnectedUserName + "---- Disconnected");
                    if ($("#" + disconnectedUserId).length > 0)
                    {
                        $("#" + disconnectedUserId).remove();
                    }
                }
            });
        }).then(function (connection)
        {
                console.log('connection started');
                btnSendMessage.on('click', function (event)
                {
                    var encryptedMessage = aesManager.encrypt(inputMessage.val());

                    // Call the Send method on the hub.
                    connection.invoke('send', userManager.getSendToUserName(), encryptedMessage);

                    deleteMeesageBox();
                    event.preventDefault();
                });
        }).catch(error =>
           {
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
    
    return {
        init: init
    }
}();