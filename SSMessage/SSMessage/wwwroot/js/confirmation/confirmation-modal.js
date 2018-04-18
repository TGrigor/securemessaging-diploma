var confirmationType = {
    Outgoing: 0,
    Incoming: 1
}

var confirmationManager = function () {
    var parentModalId;
    var $parrentModal;
    var messageBox;
    var inputKeyForEncryption;
    var modalConfirm, modalCancel;
    var confirmModalType

    var init = function () {

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
    var load = function () {
        $parrentModal.hide();

        debugger;
        modalConfirm.on('click', function () {
            debugger;
            confirmModal(confirmModalType);
        });

        modalCancel.on('click', function () {
            cancelModal();
        });
    }

    var addShowModalEvent = function (selector) {
        selector.on('click', function () {
            showModal($(this).text());
        });
    }

    var confirmModal = function (confType)
    {
        //TODO validate input
        aesManager.setKey(inputKeyForEncryption.val());

        switch (confType)
        {
            case confirmationType.Outgoing:
                connectingManager.showConnectionModal();
                hubManager.getConnection().invoke('ChatRequest', userManager.getSendToUserName());
                setTimeout(function () {
                    //Change color name hard code to enum value
                    connectingManager.changeColor(blockSide.center, "yellow");
                }, 2000);

                break;

            case confirmationType.Incoming:
                break;

            default:
        }

        confirmationManager.hideAndResetModal();

    }

    var cancelModal = function () {
        hideAndResetModal();
    }

    var showModal = function (userName) {
        userManager.setSendToUserName(userName);
        messageBox.text(" " + userName);
        $parrentModal.show("slow");
    }

    var hideAndResetModal = function () {
        $parrentModal.hide();
        confirmModalType = confirmationType.Outgoing;
        inputKeyForEncryption.val("");
        messageBox.text("");
    }

    var setConfirmationType = (type) => {
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

