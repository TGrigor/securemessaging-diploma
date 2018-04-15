var confirmationManager = function ()
{
    var parentModalId;
    var $parrentModal;
    var messageBox;
    var modal;

    var init = function ()
    {
        //Initialisation
        $parrentModal = $("#user_confirmation");
        messageBox = $("#user_confirmation_box");
        modal = $('#modalExit');
        //Events
        load();
    }
    var load = function ()
    {
        $parrentModal.hide();
        //TODO Loading icon
        //alert("Loading...");
        closeModal();
    }

    var addModalEvent = function (selector)
    {
        selector.on('click', function (e)
        {
            e.preventDefault();

            $parrentModal.show();

            messageBox.text(" " + $(this).text());

            if (modal.hasClass("showtime") === false)
            {
                modal.addClass("showtime");
            }
            else
            {
                return;
            }
        });
    }
    var closeModal = function ()
    {
        modal.on('click', function (e)
        {
            $parrentModal.hide();

            e.preventDefault();
            if (e.target.id === "modalCancel" || e.target.id === "modalConfirm")
            {
                modal.removeClass("showtime");
            }
        });
    }

    return {
        init: init,
        addModalEvent: addModalEvent,
        closeModal: closeModal
    }
}();

