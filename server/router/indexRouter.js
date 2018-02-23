const Router = require('koa-router');

let router = new Router();
router.get('/', ctx => {
    ctx.body = 'index';
});

module.exports = router;
