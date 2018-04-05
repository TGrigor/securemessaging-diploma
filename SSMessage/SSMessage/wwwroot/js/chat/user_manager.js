var actionType = {
    Online: 0,
    Offline: 1
}

var userManager = function () {
    var userList;
    var sendToUserName;
    var currentUserName;

    var name, logo, streaming;

    var init = function (userName) {
        userList = $(".user-list");
        currentUserName = userName;
        load();
    }

    var load = function () {
        userList.on("click", function () {
            sendToUserName = this.text;
        });

        $('#search').keyup(function () {
            // Get the value of the search box
            searchVal = $(this).val().toLowerCase();
            // Check each user for a match
            $('#users > .user').each(function () {
                text = $('.name', this).text().toLowerCase();
                // If the search text is found show, otherwise hide.
                if (text.indexOf(searchVal) !== -1) {
                    $(this).show()
                } else {
                    $(this).hide();
                }
            });
            // change bgcolor on tabs accordingly
            $('#all').addClass('active');
            $('#online').removeClass('active');
            $('#offline').removeClass('active');
        });

        // 'all' tab
        $('#all').click(function () {

            $('#online').removeClass('active');
            $('#all').addClass('active');
            $('#offline').removeClass('active');

            $(".user").show();
        });

        // 'online' tab
        $('#online').click(function () {

            $('#all').removeClass('active');
            $('#online').addClass('active');
            $('#offline').removeClass('active');

            $(".user").each(function () {
                if ($(this).children(".offline").length === 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });

        // 'offline' tab
        $('#offline').click(function () {
            $('#all').removeClass('active');
            $('#online').removeClass('active');
            $('#offline').addClass('active');

            $(".user").each(function () {
                if ($(this).children(".offline").length === 0) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        });
    }

    var addNewUser = function (userName, userConnectionId, aType) {
        switch (aType) {
            case actionType.Online:
                streaming = '<span class="mega-octicon octicon-check status online"></span>';
                break;
            case actionType.Offline:
                streaming = '<span class="mega-octicon octicon-x status offline"></span>';
                break;
        }

        var template = '<div class="user" id="' + userConnectionId + '">';
        template += '<img src="http://www-cdn.jtvnw.net/images/xarth/404_user_150x150.png" class="logo">';
        template += '<a href="" target="_blank">';
        template += '<span class="name">';
        template += userName;
        template += '</span>';
        template += '</a>';
        template += '<input type="hidden" value="' + userConnectionId + '">'
        template += '</div>'
        template += streaming;

        $('#users').append(template);

        //TODO change event hendler
        $("#" + userConnectionId).on("click", function ()
        {
            aesManager.setKey(prompt("Please enter Key for encrypt your message!", ""));
            sendToUserName = $(this).text();
            messagingManager.getConnection().invoke('ChatRequest', sendToUserName);;
        });
        //TODO status
        //$('#' + userName).append('<div class="topic">' + stream.stream.channel.status + '</div>');
    }

    var getSendToUserName = () => {
        return sendToUserName;
    }

    var setSendToUserName = (userName) => {
        sendToUserName = userName;
    }

    return {
        init: init,
        addNewUser: addNewUser,
        getSendToUserName: getSendToUserName,
        setSendToUserName: setSendToUserName
    }
}();