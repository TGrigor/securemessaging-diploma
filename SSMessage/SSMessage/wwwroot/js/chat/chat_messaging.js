var messageType = {
    Outgoing: 0,
    Incoming: 1
}

var messagingManager = function()
{
    var inputMessage;
    var btnSendMessage;
    var message_side = 'left';

    //Events
    var init = function(userName)
    {
        inputMessage = $("#inputMessage");
        btnSendMessage = $("#btnSendMessage");

        load();
    }
    var load = function()
    {
        //Focus to textarea
        inputMessage.focus();

        //TODO : marge events
        btnSendMessage.click(function(e)
        {
            return addMessage(getMessageText(), messageType.Outgoing);
        });
        btnSendMessage.on('click', function(event)
        {
            var encryptedMessage = cryptoManager.encryptUsingAes(inputMessage.val());

            // Call the Send method on the hub.
            hubManager.getConnection().invoke('send', userManager.getSendToUserName(), encryptedMessage);

            deleteMeesageBox();
            event.preventDefault();
        });

        // Enter key event for input
        inputMessage.keyup(function(e)
        {
            if (e.which === 13 && !e.shiftKey)
            {
                // enter key
                var code = e.keyCode ? e.keyCode : e.which;
                btnSendMessage.click();
                return addMessage(getMessageText(), messageType.Outgoing);
            }
        });
    }

    //Message class Template
    var Message = function ({ text: text1, message_side: message_side1, avatarUrl: avatarUrl1 })
    {
        this.text = strip(text1);
        this.message_side = message_side1;
        this.avatarUrl = avatarUrl1;
        this.draw = () =>
        {
            var $message;
            $message = $($('.message_template').clone().html());
            $message.addClass(this.message_side).find('.text').html(this.text);
            //$message.find('.avatar').html('<img src="'+this.avatarUrl+'" class="logo">');

            $('.messages').append($message);

            return setTimeout(function()
            {
                return $message.addClass('appeared');
            }, 0);
        };
        return this;
    }

    var getMessageText = function()
    {
        return inputMessage.val();
    }
    var addMessage = function(text, mType)
    {
        var $messages, message;

        //RegX
        //text = text.replace(/.{10}\S*\s+/g, "$&@").split(/\s+@/)

        if (text.trim() === '')
        {
            return;
        }
        $messages = $('.messages');
        var avatarUrl = "";
        switch (mType)
        {
            case messageType.Incoming:
                if (true)
                {
                    $("#notify_new_message").trigger("play");
                }
                message_side = 'right';
                avatarUrl = userManager.getSendToUserAvatarUrl();
                break;
            case messageType.Outgoing:
                message_side = 'left';
                avatarUrl = userManager.getCurrentUserAvatarUrl();
                break;
        }

        message = new Message({ text, message_side, avatarUrl});
        message.draw();

      

        return $messages.animate({
            scrollTop: $messages.prop('scrollHeight')
        }, 300);
    }
    var deleteMeesageBox = function()
    {
        // Clear text box and reset focus for next comment.
        inputMessage.val("");
        inputMessage.focus();
    }

    return {
        init: init,
        addMessage: addMessage,
        deleteMeesageBox: deleteMeesageBox
    }
}();
