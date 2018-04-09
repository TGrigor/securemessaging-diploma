var confirmationManager = function ()
{
    var parentModalId;
    var $parrentModal;
    var modal;

    var init = function (modalId)
    {
        //Initialisation
        parentModalId = modalId;
        $parrentModal = $("#" + parentModalId);
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

            $("#" + parentModalId + "_box").text(" " + $(this).text());
            debugger;
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

