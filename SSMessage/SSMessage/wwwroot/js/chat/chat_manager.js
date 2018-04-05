var chatManager = function ()
{
    var init = function (userName)
    {
        load();
        hubManager.init();
        aesManager.init();
        messagingManager.init();
        userManager.init(userName);
    }

    var load = function ()
    {
        //TODO Loading icon
        //alert("Loading...");
    }
    
    return {
        init: init
    }
}();