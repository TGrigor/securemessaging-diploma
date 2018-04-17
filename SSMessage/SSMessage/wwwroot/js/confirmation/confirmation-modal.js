var confirmationManager = function ()
{
    var parentModalId;
    var $parrentModal;
    var messageBox;
    var inputKeyForEncryption;
    var modalConfirm, modalCancel;

    var init = function ()
    {
        //Initialisation
        $parrentModal = $("#user_confirmation");
        messageBox = $("#user_confirmation_box");
        inputKeyForEncryption = $("#key_ForEncryption");

        modalConfirm = $("#modalConfirm");
        modalCancel = $("#modalCancel");

        //Events
        load();
    }
    var load = function ()
    {
        $parrentModal.hide();

        modalConfirm.on('click', function ()
        {
            confirmModal();
        });

        modalCancel.on('click', function ()
        {
            cancelModal();
        });
    }

    var addShowModalEvent = function (selector)
    {
        selector.on('click', function ()
        {
           showModal($(this).text());
        });
    }

    var confirmModal = function ()
    {
        //TODO validate input 
        aesManager.setKey(inputKeyForEncryption.val());
        hubManager.getConnection().invoke('ChatRequest', userManager.getSendToUserName());
    }

    var cancelModal = function ()
    {
        hideAndResetModal();
    }

    var showModal = function (userName)
    {
        userManager.setSendToUserName(userName);
        messageBox.text(" " + userName);
        $parrentModal.show();
    }

    var hideAndResetModal = function ()
    {
        $parrentModal.hide();
        inputKeyForEncryption.val("");
        messageBox.text("");
    }

    return {
        init: init,
        addShowModalEvent: addShowModalEvent,
        showModal: showModal,
        hideAndResetModal: hideAndResetModal
    }
}();

