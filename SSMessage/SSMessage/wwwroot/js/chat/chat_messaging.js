var messagingManager = function ()
{
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
        txtMessage.keyup(function (event) {
            var code = event.keyCode ? event.keyCode : event.which;
            if (code == 13 && !event.shiftKey) {
                addMessage();
            }
        });
    }

    var addMessage = function () {

        var messageText = txtMessage.val();
        if (messageText != '') {
            var messageBox = messageTemplate(messageText);
            txtMessage.val('');
            messageContent.append(messageBox);
        }
        //Scroll To message
        messageContent.animate({ scrollTop: messageContent.prop("scrollHeight") }, 100);
    }

    var messageTemplate = function (message) {

        message = message.replace(/.{10}\S*\s+/g, "$&@").split(/\s+@/)

        var template = "<div class=\"dvMessage\">";
        $.each(message, function (index, value) {
            template += "<span class=\"spnMessage\">";
            template += value;
            template += "</span>";
        });
        template += "</div>";
        return template;

    }

    return {
        init: init,
        addMessage: addMessage
    }
}();