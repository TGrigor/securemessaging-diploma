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