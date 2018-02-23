let redis = require('../database/redisStorage');
let config = require('../config/config')

module.exports = {
    /**
     * 登录，生成session
     * 使用时间与random参数确保前后两次session不固定
     * ICON_SESSION 用与判断每次请求判断用户是否是同一个
     *
     * @param    {Integer}          userId              用户ID
     * @param    {Object}           ctx                 请求对象
     * @return   {String}                               session的key
     */
    async setIconSession (userId, ctx) {
        return await redis.set({
            userId: userId,
            time: global.globalConfig.nowTime,
            random: Math.random(),
            type: 'ICON_SESSION'
        });
    },

    /**
     * 用于自动登录的session
     *
     * @param    {Integer}          userId              用户ID
     * @param    {Object}           ctx                 请求对象
     * @return   {String}                               session的key
     */
    async setIconAutoLoginSession (userId, ctx) {
        return await redis.set({
            userId: userId,
            time: global.globalConfig.nowTime,
            random: Math.random(),
            type: 'ICON_AUTO_LOGIN_SESSION'
        });
    },

    /**
     * 给客户端写会话cookie，每次请求带过来确认身份
     *
     * @param    {String}           value               session的key
     * @param    {Boolean}          expired             是否过期
     * @param    {Object}           ctx                 请求对象
     * @return   {void}
     */
    setIconSessionCookie (value, expired, ctx) {
        let expiredTime = expired ? new Date(config.defaultExpiresTime) : null;
        ctx.cookies.set('ICON_SESSION', value, {
            path: '/',
            domain: config.host,
            expires: expiredTime,
            httpOnly: true
        })
    },

    /**
     * 给客户端写自动登录cookie，每次请求带过来当会话cookie失效后实现自动登录
     *
     * @param    {String}           value               session的key
     * @param    {Boolean}          expired             是否过期
     * @param    {Object}           ctx                 请求对象
     * @return   {void}
     */
    setIconAutoLoginSessionCookie (value, expired, ctx) {
        let expiredTime = expired ? new Date(config.defaultExpiresTime) : new Date(global.globalConfig.nowTime + config.autoLoginSessionExpires);
        ctx.cookies.set('ICON_AUTO_LOGIN_SESSION', value, {
            path: '/',
            domain: config.host,
            expires: expiredTime,
            httpOnly: true
        });
    },

    /**
     * 获取客户端写会话cookie，每次请求带过来确认身份
     *
     * @param    {Object}           ctx                 请求对象
     * @return   {String}                               cookie值
     */
    getIconSessionCookie (ctx) {
        return ctx.cookies.get('ICON_SESSION', {
            path: '/',
            domain: config.host,
            httpOnly: true
        })
    },

    /**
     * 获取客户端写自动登录cookie
     *
     * @param    {Object}           ctx                 请求对象
     * @return   {String}                               cookie值
     */
    getIconAutoLoginSessionCookie (ctx) {
        return ctx.cookies.get('ICON_AUTO_LOGIN_SESSION', {
            path: '/',
            domain: config.host,
            httpOnly: true
        })
    }
}
