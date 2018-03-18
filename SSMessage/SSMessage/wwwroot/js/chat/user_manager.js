var userManager = function ()
{
    var userList;
    var sendToUserName;

    var init = function () {
        userList = $(".user-list");
        return load();
    },

        load = function () {
            userList.on("click", function () {
                sendToUserName = this.text;
            });
        },

        getSendToUserName = () => {
            return sendToUserName;
        }

    return {
        init: init,
        getSendToUserName: getSendToUserName
    }
}();