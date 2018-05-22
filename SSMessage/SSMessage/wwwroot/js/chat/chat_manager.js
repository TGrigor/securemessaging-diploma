var chatManager = function()
{
    var init = function(userName)
    {
        load();
        hubManager.init();
        cryptoManager.init();
        messagingManager.init();
        confirmationManager.init();
        userManager.init(userName);
        connectingManager.init();
    }

    var load = function()
    {
        var audioNewMessage = document.getElementById("notify_new_message");
        audioNewMessage.volume = 0.2;

        var audioNewRequest = document.getElementById("notify_modal");
        audioNewRequest.volume = 0.2;
        

        disableMessageBox(true);
        //TODO Loading icon
        //alert("Loading...");
    }

    var disableMessageBox = function(onOf)
    {
        //TODO simplify code
        if (onOf)
        {
            $(".chat-message-content").addClass("filterDisable");
            $(".bottom_wrapper").hide();
        }
        else
        {
            $(".chat-message-content").removeClass("filterDisable");
            $(".bottom_wrapper").show();
        }
        removeAllMessages();
    }

    var removeAllMessages = function()
    {
        $(".message-content-box").find("li").remove()
    }

    return{
        init: init,
        disableMessageBox: disableMessageBox,
        removeAllMessages: removeAllMessages
    }
}();