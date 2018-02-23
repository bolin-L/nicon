let log = require('../../../util/log');
require('request');
let rp = require('request-promise');
let jwtDecode = require('jwt-decode');
let config = require('./config');

class NeteaseOpenIdLogin {
    async login (ctx) {
        return this.getUserBaseInfo(ctx);
    }

    async getUserBaseInfo (ctx) {
        let query = ctx.request.query || {};

        if (!query.code) {
            throw new Error('login error --- no code');
        }
        let response = {};
        log.debug(`send request to openId server to get token with code: ${query.code}`);
        try {
            // use code get Access Token
            response = JSON.parse(await rp({
                uri: config.getTokenUri,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                    grant_type: config.grandType,
                    code: query.code,
                    redirect_uri: config.redirectUri,
                    client_id: config.clientId,
                    client_secret: config.clientSecret
                }
            }));
        } catch (error) {
            throw new Error(error);
        }

        if (response && !response.error) {
            // check id_token use jwt-decode
            let tokenInfo = await this.checkIdToken(response.id_token);
            let openIdUserInfo = await this.getOpenIdUserInfo(response, tokenInfo);
            return {
                userName: tokenInfo.sub,
                password: tokenInfo.sub,
                email: openIdUserInfo.email,
                nickName: openIdUserInfo.nickname,
                fullName: openIdUserInfo.fullname
            }
        }
    }

    /**
     * check openid id_token field
     *
     * @param    {String}           token                         access token string
     */
    async checkIdToken (token = '') {
        log.debug(`check id_token : ${token}`);

        // check token
        let info = jwtDecode(token) || {};
        let errMsg = '';
        if (info.aud !== config.clientId) {
            errMsg = 'clientId not match in checkIdToken'
        }
        if (info.exp * 1000 < global.globalConfig.nowTime) {
            errMsg = 'authorization key has expired'
        }
        if (errMsg) {
            throw new Error(errMsg);
        }
        return info;
    }

    /**
     * get openid userInfo by access token
     *
     * @param    {Object}           options                         access token object
     */
    async getOpenIdUserInfo (options = {}) {
        // use Access Token to get userInfo
        // popup error of ajax
        log.debug(`get openid userInfo by access token : ${options.access_token}`);
        let userInfo = {};
        try {
            userInfo = JSON.parse(await rp({
                uri: config.getUserInfoUri,
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${options.access_token}`
                }
            }));
        } catch (error) {
            throw new Error(error);
        }
        return userInfo;
    }
}

let loginIns = new NeteaseOpenIdLogin()
module.exports = loginIns.login.bind(loginIns);
