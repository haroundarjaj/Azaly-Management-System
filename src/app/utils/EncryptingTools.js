import * as CryptoJS from 'crypto-js';

const encryptString = (string) => {
    const key = CryptoJS.enc.Latin1.parse(process.env.REACT_APP_PASSWORD_SECRET_KEY);
    var iv = CryptoJS.enc.Latin1.parse('0000000000000000');
    var aesOptions = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv };
    var stringEncoded = CryptoJS.enc.Utf8.parse(string);
    let encryptdString = CryptoJS.AES.encrypt(stringEncoded, key, aesOptions).toString();

    return encryptdString;

}

const decryptString = (string) => {
    const key = CryptoJS.enc.Latin1.parse(process.env.REACT_APP_PASSWORD_SECRET_KEY);
    var iv = CryptoJS.enc.Latin1.parse('0000000000000000');
    var aesOptions = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv };
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(string)
    });
    var decryptedFromText = CryptoJS.AES.decrypt(cipherParams, key, aesOptions);
    var decryptdString = decryptedFromText.toString(CryptoJS.enc.Utf8)

    return decryptdString;
}

const EncryptingTools = {
    encryptString,
    decryptString
}

export default EncryptingTools;