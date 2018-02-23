const responseFormat = require('../util/responseFormat');
const userUtil = require('../util/userUtil');
let redis = require('../database/redisStorage');

module.exports = function () {
    return async function (ctx, next) {
        const sessionId = userUtil.getIconSessionCookie(ctx);
        let userInfo = await redis.get(sessionId);
        if (!userInfo) {
            ctx.body = responseFormat.responseFormat(401, '无权限', null);
        } else {
            ctx.userInfo = userInfo;
            await next();
        }
    }
};
