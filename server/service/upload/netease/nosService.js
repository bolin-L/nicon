/**
 * Nos Service Class
 *
 */
let log = require('../../../util/log');
let config = require('./config');
let crypto = require('crypto');
let fs = require('fs');
let request = require('request');
let rp = require('request-promise');
let qs = require('querystring');
let Buffer = require('safe-buffer').Buffer;

module.exports = class NosService {
    constructor () {
        this.host = config.host || 'nos.netease.com';
        this.cdnHost = config.cdnHost;
        this.port = config.port || 80;
        this.accessSecret = config.accessSecret || null;
        this.accessId = config.accessId || null;
        this.bucket = config.bucket || '';
    }

    /**
     * upload file
     * @param  {String} filePath - file path
     * @param  {String} key - key
     * @param  {Object} options - options
     * @return {Void}
     */
    async upload (filePath, key, options = {}) {
        if (fs.existsSync(filePath)) {
            let uploadOpts = this._getRequestDetails(Object.assign(options, {
                key,
                requestMethod: 'PUT'
            }));

            uploadOpts.body = fs.createReadStream(filePath);

            try {
                // rp 使用uri
                uploadOpts.uri = uploadOpts.url;
                let result = await rp(uploadOpts);
                if (result === '' || (result && result[0].statusCode === 200)) {
                    log.debug('[%s.upload] request NETEASE.Nos service to upload file succeeded', this.constructor.name);
                    return this.getUrl(key);
                } else {
                    log.error('[%s.upload] request NETEASE.Nos service to upload file failed', this.constructor.name, result);
                }
            } catch (ex) {
                log.error('[%s.upload] request NETEASE.Nos service to upload file failed', this.constructor.name, ex.stack);
            }
        } else {
            throw new Error(`can't find file with the path ${filePath}`);
        }
    }

    /**
     * download file
     * @param  {String} filePath - download destination
     * @param  {String} key - key
     * @return {Void}
     */
    async download (filePath, url) {
        try {
            let result = await request({
                url,
                method: 'GET',
                encoding: 'binary'
            });
            if (result && result[0].statusCode === 200) {
                let body = result[1];
                log.debug('[%s.download] request NETEASE.Nos service to download file succeeded', this.constructor.name, body);
                fs.writeFileSync(filePath, body, 'binary');
                return body;
            } else {
                log.error('[%s.download] request NETEASE.Nos service to download file failed', this.constructor.name, result);
            }
        } catch (ex) {
            log.error('[%s.download] request NETEASE.Nos service to download file failed', this.constructor.name, ex.stack);
        }
    }

    /**
     * remove file
     * @param  {String} key - nos key
     * @return {Void}
     */
    async remove (key) {
        let removeOpts = this._getRequestDetails({
            key: key,
            requestMethod: 'DELETE'
        });

        try {
            log.debug('[%s.remove] request NETEASE.Nos service to remove file', this.constructor.name, removeOpts);
            let result = await request(removeOpts);
            if (result && result[0].statusCode === 200) {
                log.debug('[%s.remove] request NETEASE.Nos service to remove file succeeded', this.constructor.name);
            } else {
                log.error('[%s.remove] request NETEASE.Nos service to remove file failed', this.constructor.name, result);
            }
        } catch (ex) {
            log.error('[%s.remove] request NETEASE.Nos service to remove file failed', this.constructor.name, ex.stack);
        }
    }

    /**
     * get request details. e.g. url, headers, method, timeout
     * @param  {Object} options - {requestMethod, key, contentType}
     * @return {Object}
     */
    _getRequestDetails (options) {
        let date = (new Date()).toUTCString();
        let method = (options && options.requestMethod) || 'GET';
        let key = (options && options.key && qs.escape(options.key)) || '';
        let contentType = options.contentType || 'application/x-www-form-urlencoded';
        let canonicalizedStr = `${method}\n\n${contentType}\n${date}\n/${this.bucket}/${key}`;
        let auth = this._getAuth(canonicalizedStr);
        let opts = {
            url: `http://${this.host}:${this.port}/${this.bucket}/${key}`,
            headers: {
                'Date': date,
                'Content-Type': contentType,
                'Authorization': `NOS ${this.accessId}:${auth}`,
                'Connection': 'close',
                'User-Agent': 'NLB Nodejs SDK/Agent',
                'Host': this.host
            },
            method: method,
            timeout: 10000
        };

        return opts;
    }

    /**
     * get encrypted auth key
     * @private
     * @param  {String} canonicalizedStr - canonicalized string to be encrypted
     * @return {String} encypted auth key
     */
    _getAuth (canonicalizedStr) {
        return crypto
            .createHmac('sha256', this.accessSecret)
            .update(canonicalizedStr)
            .digest('base64');
    }

    /**
     * get upload url
     * @private
     * @param  {String} key - nos key
     * @return {String} return url
     */
    getUrl (key) {
        key = qs.escape(key);

        let url = `//${this.cdnHost}/${key}`;
        return url;
    }

    /**
     * get token
     * @private
     * @param  {String} key - nos key
     * @return {String}
     */
    _getToken (key) {
        let expires = (+new Date()) + 30 * 60 * 1000; // 30 mins
        let date = parseInt((+new Date(expires)) / 1000);
        key = qs.escape(key);
        // more info: [https://git.hz.netease.com/nos/nos-document/blob/master/WebPostUpload/webpost.md]
        let putPolicy = JSON.stringify({
            'Bucket': this.bucket,
            'Object': key,
            'Expires': date, // in seconds
            'ReturnBody': JSON.stringify({
                url: this.getUrl(key)
            })
        });
        let encodedPutPolicy = (Buffer.from(putPolicy, 'utf8')).toString('base64');
        let sign = this._getAuth(encodedPutPolicy);

        return `UPLOAD ${this.accessId}:${sign}:${encodedPutPolicy}`;
    }
};
