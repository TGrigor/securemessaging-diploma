var confirmationType = {
    Outgoing: 0,
    Incoming: 1
}

var confirmationManager = function()
{
    var parentModalId;
    var $parrentModal;
    var messageBox;
    var inputKeyForEncryption;
    var modalConfirm, modalCancel;
    var confirmModalType;
    var requestedBy;

    var init = function()
    {
        //Initialization
        $parrentModal = $("#user_confirmation");
        messageBox = $("#user_confirmation_box");
        inputKeyForEncryption = $("#key_ForEncryption");

        modalConfirm = $("#modalConfirm");
        modalCancel = $("#modalCancel");

        confirmModalType = confirmationType.Outgoing;
        //Events
        load();
    }
    var load = function()
    {
        $parrentModal.hide();

        modalConfirm.on('click', function()
        {
            confirmModal();
        });

        modalCancel.on('click', function()
        {
            cancelModal();
        });
    }

    var addShowModalEvent = function(selector)
    {
        selector.on('click', function()
        {
            showModal($(this).text());
        });
    }

    var confirmModal = function()
    {
        //TODO validate input
        cryptoManager.setKey(inputKeyForEncryption.val());
        //TODO Change the logic when my brain will returns
        hubManager.getConnection().invoke('CancelRequest', userManager.getSendToUserName());
        userManager.setSendToUserName(requestedBy);

        switch (confirmModalType)
        {
            case confirmationType.Outgoing:
                connectingManager.showConnectionModal();
                hubManager.getConnection().invoke('ChatRequest', userManager.getSendToUserName());
                setTimeout(function()
                {
                    //Change color name hard code to enum value
                    connectingManager.changeColor(blockSide.center, "yellow");
                }, 2000);

                break;

            case confirmationType.Incoming:
                hubManager.getConnection().invoke('ConfirmRequest', userManager.getSendToUserName());
                chatManager.disableMessageBox(false);
                break;

            default:
        }

        confirmationManager.hideAndResetModal();
    }

    var cancelModal = function(confType)
    {
        switch (confirmModalType)
        {
            case confirmationType.Outgoing:
                break;

            case confirmationType.Incoming:
                hubManager.getConnection().invoke('CancelRequest', requestedBy);
                break;

            default:
        }
        hideAndResetModal();
    }

    var showModal = function(userName)
    {
        requestedBy = userName;
        messageBox.text(" " + userName);
        $parrentModal.show("slow");
    }

    var hideAndResetModal = function()
    {
        $parrentModal.hide();
        confirmModalType = confirmationType.Outgoing;
        inputKeyForEncryption.val("");
        messageBox.text("");
    }

    var setConfirmationType = (type) =>
    {
        confirmModalType = type;
    }

    return {
        init: init,
        addShowModalEvent: addShowModalEvent,
        showModal: showModal,
        hideAndResetModal: hideAndResetModal,
        setConfirmationType: setConfirmationType
    }
}();

