require('request');
let rp = require('request-promise');
let config = require('./config');

class GithubOpenIdLogin {
    async login (ctx) {
        return this.getUserBaseInfo(ctx);
    }

    async getUserBaseInfo (ctx) {
        let query = ctx.request.query || {};
        let code = query.code;

        let token = await this.getToken(code);
        return await this.getUserInfo(token);
    }

    async getToken (code) {
        let uri = `https://github.com/login/oauth/access_token`;
        let response = await rp({
            uri: uri,
            method: 'POST',
            body: {
                client_id: config.clientId,
                client_secret: config.clientSecret,
                code: code
            },
            json: true
        });
        return response.access_token;
    }

    async getUserInfo (token) {
        let userInfo = {};
        try {
            userInfo = JSON.parse(await rp({
                uri: `https://api.github.com/user?access_token=${token}&scope=user`,
                method: 'GET',
                headers: {
                    'User-Agent': 'lbl-dev'
                }
            }));
        } catch (err) {
            throw new Error(err);
        }

        return {
            userName: userInfo.login || userInfo.name
        };
    }
}

let loginIns = new GithubOpenIdLogin();
module.exports = loginIns.login.bind(loginIns);
