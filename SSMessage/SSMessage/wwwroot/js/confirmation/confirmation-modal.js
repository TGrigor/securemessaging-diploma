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
            userManager.setSendToUserAvatarUrl($(this).find(".logo").attr('src'));
            showModal($(this).text());
        });
    }

    var confirmModal = function()
    {
        //TODO Change the logic when my brain will returns
        hubManager.getConnection().invoke('CancelRequest', userManager.getSendToUserName());
        userManager.setSendToUserName(requestedBy);

        switch (confirmModalType)
        {
            case confirmationType.Outgoing:
                //connectingManager.changeConectionStatus(statusType.GeneratingKey);
                connectingManager.showConnectionModal();
                cryptoManager.generateNewRsaKeys();
                console.log(cryptoManager.getGeneratedTimeReport());
                hubManager.getConnection().invoke('ChatRequest', userManager.getSendToUserName(), cryptoManager.getRsaPublicKey());
                setTimeout(function()
                {
                    //Change color name hard code to enum value
                    connectingManager.changeColor(blockSide.center, "yellow");
                }, 2000);

                break;

            case confirmationType.Incoming:
                var randomAesKey = randomString();
                cryptoManager.setKey(randomAesKey);
                var encryptedAesKey = cryptoManager.encryptUsingRsa(randomAesKey);

                hubManager.getConnection().invoke('ConfirmRequest', userManager.getSendToUserName(), encryptedAesKey);
                //TODO remove dublication and add one function in conecting manager
                chatManager.disableMessageBox(false);
                connectingManager.showConnectionModal();
                connectingManager.changeConectionStatus(statusType.Connected);
                connectingManager.changeColor(blockSide.center, "#296c00");
                connectingManager.changeColor(blockSide.background, "#296c00");
                setTimeout(function () {
                    connectingManager.hideConnectionModal();
                }, 5000);
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

