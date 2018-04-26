var statusType = {
    Canceled: 0,
    Connected: 1
}

var blockSide = {
    right: 0,
    left: 1,
    center: 2,
    background: 3
}

var connectingManager = function()
{
    var connModal;
    var connectingStatusText;
    var leftConnectionBlock, rightConnectionBlock, centerLine;

    var init = function()
    {
        //Initialization
        connModal = $(".connecting")
        connectingStatusText = $("#text-box-connection-status");
        leftConnectionBlock = $(".left-connection-block");
        rightConnectionBlock = $(".right-connection-block");
        centerLine = $(".con");
        //Events
        load();
    }
    var load = function()
        {}

    var changeConectionStatus = function(connectionStatus)
    {
        switch (connectionStatus)
        {
            case statusType.Connected:
                connectingStatusText.text("User Connected!");
                //Color green
                break;
            case statusType.Canceled:
                connectingStatusText.text("User cancel request!");
                //Color red
                break;
        }
    }

    var changeColor = function(side, color)
    {
        switch (side)
        {
            case blockSide.right:
                rightConnectionBlock.css("color", color);
                rightConnectionBlock.css("background", color);
                break;
            case blockSide.left:
                leftConnectionBlock.css("color", color);
                leftConnectionBlock.css("background", color);
                break;
            case blockSide.center:
                centerLine.css("color", color);
                centerLine.css("background", color);
                break;
            case blockSide.background:
                connModal.css("background", color);
                break;
        }
    }

    var resetConnectionModal = function()
    {
        connectingStatusText.text("CONNECTING");
        changeColor(blockSide.center, "white")
        changeColor(blockSide.background, "#459BF9")
    }

    var showConnectionModal = () =>
    {
        connModal.show();
    }

    var hideConnectionModal = () =>
    {
        connModal.hide();
        resetConnectionModal();
    }

    return {
        init: init,
        changeConectionStatus: changeConectionStatus,
        changeColor: changeColor,
        showConnectionModal: showConnectionModal,
        hideConnectionModal: hideConnectionModal
    }
}();
