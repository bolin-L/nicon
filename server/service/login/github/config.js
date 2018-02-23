let pe = process.env;
let config = require('../../../config/config');

module.exports = {
    clientId: pe.GITHUB_LOGIN_CLIENT_ID,
    clientSecret: pe.GITHUB_LOGIN_CLIENT_SECRET,
    loginUrl: `https://github.com/login/oauth/authorize?client_id=${pe.GITHUB_LOGIN_CLIENT_ID}&redirect_uri=http://${config.host}/api/user/openid&scope=user`
};
