let cryptoJs = require('crypto-js');
let crypto = require('crypto');
let config = require('../config/config');
module.exports = {
    /**
     * 加盐加密
     *
     * @param    {Object|String}        data                需要加密的数据
     * @param    {String}               salt                盐
     * @return   {String}                                   加密后的自负窜key
     */
    encrypt (data, salt) {
        if (typeof data === 'object') {
            try {
                data = JSON.stringify(data);
            } catch (error) {
                data = 'error_string_' + (+new Date())
            }
        }
        return cryptoJs.AES.encrypt(data + '', salt || config.salt);
    },

    /**
     * 加盐解密
     *
     * @param    {String}               data                加密过的密钥
     * @param    {String}               salt                加密时用的盐
     * @return   {Object|String}                            加密前数据
     */
    decrypt (data, salt) {
        let bytes = cryptoJs.AES.decrypt(data.toString(), salt || config.salt);
        try {
            data = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
        } catch (error) {
            data = bytes.toString(cryptoJs.enc.Utf8);
        }
        return data;
    },

    /**
     * generate an unique seed
     * @return {String} unique seed
     */
    seed: (function () {
        let seed = +new Date();
        return function () {
            return String(seed++);
        };
    })(),

    /**
     * generate a random string
     * @param {Number} length - length of the random string
     * @param {Boolean} onlyNum - whether the random string consists of only numbers
     * @param {Boolean} isComplex - whether the random string can contain complex chars
     * @return {String} generated random string
     */
    randString: (function () {
        let complexChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$%^&*()-=_+,./<>?;:[{}]\'"~`|\\';
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        let numchars = '0123456789';
        return function (length, onlyNum, isComplex) {
            let strs = isComplex ? complexChars : chars;
            strs = onlyNum ? numchars : strs;
            length = length || 10;
            let ret = [];
            for (let i = 0, it; i < length; ++i) {
                it = Math.floor(Math.random() * strs.length);
                ret.push(strs.charAt(it));
            }
            return ret.join('');
        };
    })(),

    /**
     * md5 encryption
     * @param {String} content - content to be encrpted
     * @return {String} encryption
     */
    md5 (content) {
        return crypto
            .createHash('md5')
            .update(content)
            .digest('hex');
    },

    /**
     * generate an unique key
     * @return {String} unique key
     */
    uniqueKey () {
        let key = 'site' + this.seed() + this.randString(16);
        return this.md5(key);
    }
};
