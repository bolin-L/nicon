const indexRouter = require('./indexRouter');
const repoRouter = require('./repoRouter');
const userRouter = require('./userRouter');
const iconRouter = require('./iconRouter');
const iconDraftRouter = require('./iconDraftRouter');

module.exports = class AppRouter {
    constructor (app) {
        // 首页 操作路由
        app.use(indexRouter.routes());

        // 仓库CRUD
        app.use(repoRouter.routes());

        // 图标CRUD
        app.use(iconRouter.routes());

        // 图标草稿CRUD
        app.use(iconDraftRouter.routes());

        // 用户相关操作
        app.use(userRouter.routes());
    }
};
