let Router = require('koa-router');
let auth = require('../middleware/auth');
let IconController = require('../controller/iconController');
let iconControllerIns = new IconController();

let router = new Router({
    prefix: '/api/icon'
});

/**
 * 获取图标列表
 *
 */
router.get('/list/:userId', async (ctx) => {
    await iconControllerIns.getIconList(ctx);
});

/**
 * delete user icon
 *
 */
router.post('/delete/:iconId', auth(), async (ctx) => {
    await iconControllerIns.deleteIcon(ctx);
});

/**
 * 下载图标
 *
 */
router.get('/download/:iconId', async (ctx) => {
    await iconControllerIns.downloadIcon(ctx);
});

module.exports = router;
