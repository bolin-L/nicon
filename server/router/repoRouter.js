let Router = require('koa-router');
let auth = require('../middleware/auth');
let getUserInfo = require('../middleware/getUserInfo');
let router = new Router({
    prefix: '/api/repo'
});
let RepoController = require('../controller/repoController');
let repoControllerIns = new RepoController();

/**
 * add icon repo
 *
 */
router.post('/add', auth(), async (ctx) => {
    await repoControllerIns.addRepo(ctx);
});

/**
 * my icon repo list
 *
 */
router.get('/list/:userId', async (ctx) => {
    await repoControllerIns.getRepoList(ctx);
});

/**
 * add icon to repo
 *
 */
router.post('/add/icon', auth(), async (ctx) => {
    await repoControllerIns.addIcon2Repo(ctx);
});

/**
 * delete icon from repo
 *
 */
router.post('/:repoId/:iconId/delete', auth(), async (ctx) => {
    await repoControllerIns.deleteIconFromRepo(ctx);
});

/**
 * get info of repo
 *
 */
router.get('/:repoId/get', getUserInfo(), async (ctx) => {
    await repoControllerIns.getRepoInfo(ctx);
});

/**
 * update repo info
 *
 */
router.post('/:repoId/update', auth(), async (ctx) => {
    await repoControllerIns.updateRepoInfo(ctx);
});

/**
 * update repo info
 *
 */
router.get('/:repoId/resource', async (ctx) => {
    await repoControllerIns.getRepoResource(ctx);
});

/**
 * sync repo of database and css file
 *
 */
router.post('/:repoId/sync', auth(), async (ctx) => {
    await repoControllerIns.syncRepo(ctx);
});

/**
 * add member of repo
 *
 */
router.post('/:repoId/member/add', auth(), async (ctx) => {
    await repoControllerIns.addMember(ctx);
});

/**
 * get recommend repo list
 *
 */
router.get('/recommend/list', async (ctx) => {
    await repoControllerIns.getRecommendRepoList(ctx);
});

/**
 * update recommend repo list
 *
 */
router.post('/recommend/add', async (ctx) => {
    await repoControllerIns.addRecommendRepo(ctx);
});

/**
 * update recommend repo list
 *
 */
router.post('/recommend/delete', async (ctx) => {
    await repoControllerIns.deleteRecommendRepo(ctx);
});

module.exports = router;
