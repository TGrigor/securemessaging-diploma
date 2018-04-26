var cryptoManager = function()
{
    var aesKey = "";

    var publicKey = "";
    var privateKey = "";
    var generatedTimeReport = "";

    var init = function()
    {
        load();
    }
    var load = function()
    {

    }

    var encryptUsingAes = function(text)
    {
        if (aesKey.length > 0)
        {
            return CryptoJS.AES.encrypt(text, aesKey).toString();
        }
        return "Message not encrypted!";
    }
    var decryptUsingAes = function(ciphertext)
    {
        if (aesKey.length > 0)
        {
            return CryptoJS.AES.decrypt(ciphertext.toString(), aesKey).toString(CryptoJS.enc.Utf8).toString();
        }
        return "Message not decrypted!";
    }

    var encryptUsingRsa = function(text)
    {
        var crypt = new JSEncrypt();
        crypt.setPublicKey(publicKey);
        
        return crypt.encrypt(text);; 
    }
    var decryptUsingRsa = function(crypted)
    {
        var crypt = new JSEncrypt();
        crypt.setPrivateKey(privateKey);

        return crypt.decrypt(crypted);
    }

    var generateNewRsaKeys = function()
    {
        //Configuration
        var keySize = parseInt(2048);
        var async = false;
        var dt = new Date();
        var crypt = new JSEncrypt({ default_key_size: keySize });
        var time = -(dt.getTime());

        if (async) 
        {
            crypt.getKey(function () {
                dt = new Date();
                time += (dt.getTime());
                generatedTimeReport = 'Generated in ' + time + ' ms';
                privateKey = crypt.getPrivateKey();
                publicKey = crypt.getPublicKey();
            });
            return;
        }
        crypt.getKey();
        dt = new Date();
        time += (dt.getTime());
        generatedTimeReport = 'Generated in ' + time + ' ms';
        privateKey = crypt.getPrivateKey();
        publicKey = crypt.getPublicKey();
    }

    var getKey = () =>
    {
        return aesKey;
    }
    var setKey = (key) =>
    {
        aesKey = key;
    }

    var getRsaPublicKey = () =>
    {
        return publicKey;
    }
    var setRsaPublicKey = (rsaKey) =>
    {
        publicKey = rsaKey;
    }
    var getGeneratedTimeReport = () =>
    {
        return generatedTimeReport;
    }

    return {
        init: init,
        getKey: getKey,
        setKey: setKey,
        encryptUsingAes: encryptUsingAes,
        decryptUsingAes: decryptUsingAes,
        generateNewRsaKeys: generateNewRsaKeys,
        getRsaPublicKey: getRsaPublicKey,
        setRsaPublicKey: setRsaPublicKey,
        getGeneratedTimeReport: getGeneratedTimeReport,
        encryptUsingRsa: encryptUsingRsa,
        decryptUsingRsa: decryptUsingRsa
    }
}();