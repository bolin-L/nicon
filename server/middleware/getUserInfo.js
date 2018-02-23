const userUtil = require('../util/userUtil');
let redis = require('../database/redisStorage');

module.exports = function () {
    return async function (ctx, next) {
        const sessionId = userUtil.getIconSessionCookie(ctx);
        let userInfo = await redis.get(sessionId);
        ctx.userInfo = userInfo || {};
        await next();
    }
};
