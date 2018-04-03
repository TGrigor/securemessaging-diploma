var aesManager = function () {
    var KEY = "";

    var init = function () {
        load();
    }

    var load = function () {
    }

    var encrypt = function (text) {
        if (KEY.length > 0) {
            return CryptoJS.AES.encrypt(text, KEY).toString();
        }
        return "Message not encrypted!";
    }
    var decrypt = function (ciphertext) {
        if (KEY.length > 0) {
            return CryptoJS.AES.decrypt(ciphertext.toString(), KEY).toString(CryptoJS.enc.Utf8).toString();
        }
        return "Message not decrypted!";
    }

    var getKey = () => {
        return KEY;
    }
    var setKey = function (key) {
        KEY = key;
    }

    return {
        init: init,
        getKey: getKey,
        setKey: setKey,
        encrypt: encrypt,
        decrypt: decrypt
    }
}();