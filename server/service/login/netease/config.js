let pe = process.env;
module.exports = {
    scope: pe.scope,
    authUrl: pe.authUrl,
    responseType: pe.responseType,
    grandType: pe.grandType,
    clientId: pe.clientId,
    clientSecret: pe.clientSecret,
    redirectUri: pe.redirectUri,
    getTokenUri: pe.getTokenUri,
    getUserInfoUri: pe.getUserInfoUri,
    loginUrl: pe.loginUrl
};
