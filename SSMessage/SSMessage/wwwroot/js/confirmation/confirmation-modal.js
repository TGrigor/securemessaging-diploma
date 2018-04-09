var confirmationManager = function () {

    var init = function () {
        //Initialisation

        //Events
        load();
    }

    var load = function () {
        //TODO Loading icon
        //alert("Loading...");
        displayModal();
        closeModal();
    }

    var displayModal = function ()
    {
        var modal = document.querySelector('#modalExit');
        var button = document.querySelector('#button');

        button.addEventListener('click', function (e) {
            e.preventDefault();

            if (modal.classList.contains('showtime') === false) {
                modal.classList.add('showtime');
            } else {
                return;
            }
        });
    }

    var closeModal = function ()
    {
        var modal = document.querySelector('#modalExit');

        modal.addEventListener('click', function (e) {
            e.preventDefault();

            if (e.target.id === "modalCancel" || e.target.id === "modalConfirm") {
                modal.classList.remove('showtime');
            }
        });
    }

    return {
        init: init,
        displayModal: displayModal,
        closeModal: closeModal
    }
}();

