/**
 * user login & register & logout operation
 *
 */

const config = require('../config/config');
const log = require('../util/log');
const responseFormat = require('../util/responseFormat');
const userRegisterRules = require('../validation/userRegisterRules');
const userLoginRules = require('../validation/userLoginRules');
const validator = require('../util/validator');
const db = require('../database');
const redis = require('../database/redisStorage');
const incUtil = require('../util/incUtil');
const cryptoUtil = require('../util/cryptoUtil');
const userUtil = require('../util/userUtil');
const avatarConfig = require('../config/avatarConfig');
const loginService = require('../service/login');

class UserController {
    /**
     * user openid login
     *
     * @param    {Object}           ctx                         request object
     */
    async userOpenIdLogin (ctx) {
        const userInfo = await loginService.login(ctx)
        if (!userInfo) {
            throw new Error('login fail, no userInfo return');
        }
        if (!userInfo.userName) {
            throw new Error('login fail, userInfo.userName is required');
        }
        await this.appThirdLogin(ctx, userInfo);
    }

    /**
     * app login
     *
     * @param    {Object}           ctx                         request object
     * @param    {Object}           userInfo                    user info
     * @return   {void}
     */
    async appThirdLogin (ctx, userInfo) {
        const existUser = await db.user.findOne({
            userName: userInfo.userName
        }, global.globalConfig.userExportFields);
        // exist go login or go register
        if (existUser) {
            await this.userThirdLogin(ctx, existUser)
        } else {
            await this.userThirdRegister(ctx, {
                userName: userInfo.userName,
                password: userInfo.password,
                email: userInfo.email,
                nickName: userInfo.nickname,
                fullName: userInfo.fullname
            })
        }
    }

    /**
    * app third user login
    *
    * @param    {Object}           ctx                         request object
    * @param    {Object}           userInfo                    user info from app database
    */
    async userThirdLogin (ctx, userInfo) {
        const sessionId = await userUtil.setIconSession(userInfo.userId, ctx);
        const autoLoginSessionId = await userUtil.setIconAutoLoginSession(userInfo.userId, ctx);
        // generate session to redis and set cookie to client
        userUtil.setIconSessionCookie(sessionId, false, ctx);
        userUtil.setIconAutoLoginSessionCookie(autoLoginSessionId, false, ctx);
        // redirect to index page after login success
        // todo redirect to where request come from
        ctx.redirect(config.url);
    }

    /**
     * app third user register use user info from openid login
     *
     * @param    {Object}           ctx                         request object
     * @param    {Object}           params                      openid userInfo
     */
    async userThirdRegister (ctx, params) {
        // get increment userId
        const userId = await incUtil.getIncId({ model: 'user', field: 'userId' });
        // set random avatar
        const index = parseInt(Math.random() * 105);
        const avatar = avatarConfig[index];

        // build register userInfo
        Object.assign(params, {
            createTime: global.globalConfig.nowTime,
            updateTime: global.globalConfig.nowTime,
            avatar,
            userId
        });
        log.debug(`user register and info: ${JSON.stringify(params)}`);

        // save userInfo to app database
        await db.user.add(params);
        const sessionId = await userUtil.setIconSession(userId, ctx);
        const autoLoginSessionId = await userUtil.setIconAutoLoginSession(userId, ctx);
        // generate session to redis and set cookie to client
        userUtil.setIconSessionCookie(sessionId, false, ctx);
        userUtil.setIconAutoLoginSessionCookie(autoLoginSessionId, false, ctx);
        ctx.redirect(config.url);
    }

    /**
     * 用户登录
     *
     * @param    {Object}           ctx                         请求对象
     */
    async userLogin (ctx) {
        const params = ctx.request.body || {};
        // 验证数据完整性
        validator.validateParamsField(params, userLoginRules, ctx);

        // 查询数据库，判断唯一性
        const userInfo = await db.user.findOne({
            userName: params.userName
        });
        if (userInfo) {
            // 密码校验，正确则生成session
            if (userInfo.password === params.password) {
                const sessionId = await userUtil.setIconSession(userInfo.userId, ctx);
                const autoLoginSessionId = await userUtil.setIconAutoLoginSession(userInfo.userId, ctx);
                // 生成session后给给客户端写cookie
                userUtil.setIconSessionCookie(sessionId, false, ctx);
                userUtil.setIconAutoLoginSessionCookie(autoLoginSessionId, false, ctx);
                delete userInfo.password;
                ctx.body = responseFormat.responseFormat(200, '', userInfo);
            } else {
                ctx.body = responseFormat.responseFormat(200, {
                    password: {
                        message: '密码错误',
                        success: false
                    }
                }, false);
            }
        } else {
            ctx.body = responseFormat.responseFormat(200, {
                userName: {
                    message: '账号不存在！',
                    success: false
                }
            }, false);
        }
    }

    /**
     * 用户注册
     *
     * @param    {Object}           ctx                         请求对象
     */
    async userRegister (ctx) {
        const params = ctx.request.body || {};
        // 验证数据完整性
        validator.validateParamsField(params, userRegisterRules, ctx);

        // 查询数据库，判断唯一性
        const userResult = await db.user.findOne({
            userName: params.userName
        });
        if (userResult) {
            ctx.body = responseFormat.responseFormat(200, {
                userName: {
                    message: '用户名已经存在, 请直接登录',
                    success: false
                }
            }, false);
            return;
        }

        // 获取唯一自增Id
        const userId = await incUtil.getIncId({ model: 'user', field: 'userId' });
        // set random avatar
        const index = parseInt(Math.random() * 105);
        const avatar = avatarConfig[index];

        // 构建完整用户注册数据
        Object.assign(params, {
            createTime: global.globalConfig.nowTime,
            updateTime: global.globalConfig.nowTime,
            avatar,
            userId,
            userName: String(params.userName)
        });

        // 保存用户信息到数据库
        await db.user.add(params);
        const sessionId = await userUtil.setIconSession(userId, ctx);
        const autoLoginSessionId = await userUtil.setIconAutoLoginSession(userId, ctx);
        // 生成session后给给客户端写cookie
        userUtil.setIconSessionCookie(sessionId, false, ctx);
        userUtil.setIconAutoLoginSessionCookie(autoLoginSessionId, false, ctx);

        delete params.password;
        ctx.body = responseFormat.responseFormat(200, '', params);
    }

    /**
     * app user logout
     *
     * @param    {Object}           ctx                         request object
     */
    async userLogout (ctx) {
        const sessionId = ctx.cookies.get('ICON_SESSION', {
            domain: config.host,
            path: '/',
            httpOnly: true
        });
        const autoLoginSessionId = ctx.cookies.get('ICON_AUTO_LOGIN_SESSION', {
            domain: config.host,
            path: '/',
            httpOnly: true
        });
        await redis.destroy(sessionId);
        await redis.destroy(autoLoginSessionId);
        userUtil.setIconSessionCookie(sessionId, true, ctx);
        userUtil.setIconAutoLoginSessionCookie(autoLoginSessionId, true, ctx);
        ctx.body = responseFormat.responseFormat(200, '', {
            loginUrl: loginService.config.loginUrl
        });
    }

    /**
     * get current login userInfo
     *
     * @param    {Object}           ctx                         request object
     */
    async getCurLoginUserInfo (ctx) {
        const autoLoginSessionId = ctx.cookies.get('ICON_AUTO_LOGIN_SESSION', {
            domain: config.host,
            path: '/',
            httpOnly: true
        });
        // return loginUrl if not login
        let userInfo = {
            loginUrl: loginService.config.loginUrl
        };
        if (autoLoginSessionId) {
            // return userInfo and cookie ICON_SESSION if user exist
            const exist = await redis.get(autoLoginSessionId);
            // decrypt cookie for get userId
            let userInfoCur = cryptoUtil.decrypt(autoLoginSessionId, '');
            userInfoCur = await db.user.findOne({ userId: userInfoCur.userId }, global.globalConfig.userExportFields);
            if (userInfoCur) {
                userInfo = userInfoCur;
            }
            if (exist && userInfoCur && userInfoCur.userId) {
                // set cookie to client
                const sessionId = await userUtil.setIconSession(userInfoCur.userId, ctx);
                userUtil.setIconSessionCookie(sessionId, false, ctx);
            } else if (userInfoCur && userInfoCur.userId) {
                // user exist but session expired in redis, need to generate session to redis then auto login
                const autoLoginSessionId = await userUtil.setIconAutoLoginSession(userInfoCur.userId, ctx);
                const sessionId = await userUtil.setIconSession(userInfoCur.userId, ctx);
                userUtil.setIconSessionCookie(sessionId, false, ctx);
                userUtil.setIconAutoLoginSessionCookie(autoLoginSessionId, false, ctx);
            }
        }
        ctx.body = responseFormat.responseFormat(200, '', userInfo);
    }

    /**
     * get specific userInfo
     *
     * @param    {Object}           ctx                         request object
     */
    async getUserInfo (ctx) {
        const params = ctx.params;
        const userInfo = await db.user.findOne({ userId: params.userId }, global.globalConfig.userExportFields);
        if (!userInfo) {
            ctx.body = responseFormat.responseFormat(500, 'user not exist', false);
        } else {
            ctx.body = responseFormat.responseFormat(200, '', userInfo);
        }
    }
};

module.exports = UserController;
