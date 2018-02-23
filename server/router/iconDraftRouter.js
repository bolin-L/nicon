let Router = require('koa-router');
let auth = require('../middleware/auth');
let IconDraftController = require('../controller/iconDraftController');
let iconDraftControllerIns = new IconDraftController();

let router = new Router({
    prefix: '/api/icon/draft'
});

/**
 * 下载图标
 *
 */
router.get('/download/:iconId', async (ctx) => {
    await iconDraftControllerIns.downloadIcon(ctx);
});

/**
 * 我的草稿图标列表
 *
 */
router.get('/list', auth(), async (ctx) => {
    await iconDraftControllerIns.getIconDraftList(ctx);
});

/**
 * 添加图标草稿
 *
 */
router.post('/add', auth(), async (ctx) => {
    await iconDraftControllerIns.saveDraftIcon(ctx);
});

/**
 * collect to transform to draft
 *
 */
router.post('/collect', auth(), async (ctx) => {
    await iconDraftControllerIns.collectIcon(ctx);
});

/**
 * 删除图标草稿
 *
 */
router.post('/delete', auth(), async (ctx) => {
    await iconDraftControllerIns.deleteDraftIcon(ctx);
});

/**
 * 更新图标草稿
 *
 */
router.post('/update', auth(), async (ctx) => {
    await iconDraftControllerIns.updateDraftIcon(ctx);
});

/**
 * 提交草稿转换成正式字体图标并删除
 *
 */
router.post('/2icon', auth(), async (ctx) => {
    await iconDraftControllerIns.changeDraft2Icon(ctx);
});

module.exports = router;
