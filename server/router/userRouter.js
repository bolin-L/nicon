const Router = require('koa-router');
let UserController = require('../controller/userController');
let userControllerIns = new UserController();

let router = new Router({
    prefix: '/api/user'
});

/**
 * user openid login
 *
 */
router.get('/openid', async (ctx) => {
    await userControllerIns.userOpenIdLogin(ctx);
});

/**
 * app login
 *
 */
router.post('/login', async (ctx) => {
    await userControllerIns.userLogin(ctx);
});

/**
 * app register, login after registered
 *
 */
router.post('/register', async (ctx) => {
    await userControllerIns.userRegister(ctx);
});

/**
 * app logout
 *
 */
router.post('/logout', async (ctx) => {
    await userControllerIns.userLogout(ctx);
});

/**
 * get userInfo of current login user
 * get ICON_AUTO_LOGIN_SESSION cookie from request
 *
 */
router.get('/get', async (ctx) => {
    await userControllerIns.getCurLoginUserInfo(ctx);
});

/**
 * get userInfo
 * get ICON_AUTO_LOGIN_SESSION cookie from request
 *
 */
router.get('/:userId/get', async (ctx) => {
    await userControllerIns.getUserInfo(ctx);
});
module.exports = router;
