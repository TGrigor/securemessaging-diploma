var actionType = {
    Online: 0,
    Offline: 1
}

var userManager = function()
{
    var userList;
    var sendToUserName;
    var currentUserName;
    var currentUserAvatarUrl;
    var sendToUserAvatarUrl;

    //Events
    var init = function(userName)
    {
        userList = $(".user");
        currentUserName = userName;
        var pictureNumber = Math.floor(Math.random() * 7) + 1;
        currentUserAvatarUrl = "/images/user_pictures/userPicture_0" + pictureNumber + ".png";
        load();
    }
    var load = function()
    {
        //TODO: change
        userList.on("click", function()
        {
            sendToUserName = this.text;
        });

        $('#search')
            .keyup(function()
            {
                // Get the value of the search box
                searchVal = $(this).val().toLowerCase();
                // Check each user for a match
                $('#users > .user')
                    .each(function()
                    {
                        text = $('.name', this).text().toLowerCase();
                        // If the search text is found show, otherwise hide.
                        if (text.indexOf(searchVal) !== -1)
                        {
                            $(this).show()
                        }
                        else
                        {
                            $(this).hide();
                        }
                    });
                // change bgcolor on tabs accordingly
                $('#all').addClass('active');
                $('#online').removeClass('active');
                $('#offline').removeClass('active');
            });

        // 'all' tab
        $('#all')
            .click(function()
            {
                $('#online').removeClass('active');
                $('#all').addClass('active');
                $('#offline').removeClass('active');

                $(".user").show();
            });

        // 'online' tab
        $('#online')
            .click(function()
            {
                $('#all').removeClass('active');
                $('#online').addClass('active');
                $('#offline').removeClass('active');

                $(".user")
                    .each(function()
                    {
                        if ($(this).children(".offline").length === 0)
                        {
                            $(this).show();
                        }
                        else
                        {
                            $(this).hide();
                        }
                    });
            });

        // 'offline' tab
        $('#offline')
            .click(function()
            {
                $('#all').removeClass('active');
                $('#online').removeClass('active');
                $('#offline').addClass('active');

                $(".user")
                    .each(function()
                    {
                        if ($(this).children(".offline").length === 0)
                        {
                            $(this).hide();
                        }
                        else
                        {
                            $(this).show();
                        }
                    });
            });
    }

    //Methods
    var addNewUser = function(userName, userConnectionId, aType)
    {
        var streaming;
        switch (aType)
        {
            case actionType.Online:
                streaming = '<span class="mega-octicon octicon-check status online"></span>';
                break;
            case actionType.Offline:
                streaming = '<span class="mega-octicon octicon-x status offline"></span>';
                break;
        }

        var template = '<div class="user" id="' + userConnectionId + '">';
        //change picture
        var pictureNumber = Math.floor(Math.random() * 7) + 1;
        var src = "/images/user_pictures/userPicture_0" + pictureNumber + ".png";
        template += '<img src="'+ src +'" class="logo">';
        template += '<span class="name">';
        template += userName;
        template += '</span>';
        template += '<input type="hidden" value="' + userConnectionId + '">'
        template += '</div>'
        template += streaming;

        $('#users').append(template);
        confirmationManager.addShowModalEvent($("#" + userConnectionId));
        //TODO change event hendler
        $("#" + userConnectionId)
            .on("click", function()
                {});
        //TODO status
        //$('#' + userName).append('<div class="topic">' + stream.stream.channel.status + '</div>');
    }
    var getCurrentUserName = () =>
    {
        return currentUserName;
    }
    var getSendToUserName = () =>
    {
        return sendToUserName;
    }
    var setSendToUserName = (userName) =>
    {
        sendToUserName = userName;
    }
    var getUsers = () =>
    {
        return $(".user");
    }
    var removeUsers = () =>
    {
        $(".user").remove();
    }
    var removeUserById = (userId) =>
    {
        if ($("#" + userId).length > 0)
        {
            $("#" + userId).remove();
        }
    }
    var getCurrentUserAvatarUrl = () => {
        return currentUserAvatarUrl;
    }
    var getSendToUserAvatarUrl = () => {
        return sendToUserAvatarUrl;
    }
    var setSendToUserAvatarUrl = (src) => {
        sendToUserAvatarUrl = src;
    }

    return {
        init: init,
        addNewUser: addNewUser,
        getCurrentUserName: getCurrentUserName,
        getSendToUserName: getSendToUserName,
        getCurrentUserAvatarUrl: getCurrentUserAvatarUrl,
        getSendToUserAvatarUrl: getSendToUserAvatarUrl,
        getUsers: getUsers,
        setSendToUserName: setSendToUserName,
        setSendToUserAvatarUrl: setSendToUserAvatarUrl,
        removeUsers: removeUsers,
        removeUserById: removeUserById
    }
}();