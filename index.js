let Koa = require('koa');
let app = new Koa();
const KoaStatic = require('koa-static');
let fileUtil = require('./server/util/fileUtil');
let installApp = require('./server/middleware/install');
let log = require('./server/util/log');
let bodyParser = require('koa-bodyparser');
let koaBody = require('koa-body');
let config = require('./server/config/config');
let responseFormat = require('./server/util/responseFormat');
let path = require('path');
let startFilePath = path.resolve(__dirname, './bin/start.sh');

/**
 * register router and connect db to expose serve
 *
 * @return   {void}
 */
async function startServe () {
    if (await fileUtil.exists(startFilePath)) {
        let AppRouter = require('./server/router/index');
        let connectDB = require('./server/database/connect');
        let redis = require('./server/database/redisStorage.js');
        let session = require('koa-session2');

        // redis记录session
        app.use(session({
            store: redis
        }));

        await connectDB();

        // register router
        new AppRouter(app);
    } else {
        app.use(installApp())
    }
}

/**
 * entrance
 *
 * @return   {void}
 */
async function start () {
    // 处理全局错误
    app.use(async (ctx, next) => {
        try {
            const start = +new Date();
            const result = await next();
            const spendTime = +new Date() - start;
            const normalTTL = 350;
            const requestStatus = spendTime > normalTTL ? 'optimize' : 'normal';
            log.debug(`[${requestStatus}] request [${ctx.originalUrl}] spend time is ${spendTime}ms ...`);
            return result;
        } catch (error) {
            // todo 做日志处理
            // 统一错误出口
            let er = error || {};
            ctx.status = 200;
            let message = er.message;
            if (er.code === 11000) {
                message = (message.match(/"(.*)"/) || [])[1] + ' 名称重复，请修改！'
            }
            let stack = er.stack || er;
            log.error(stack);
            ctx.body = responseFormat.responseFormat(500, message || stack, false);
        }
    });

    // 设置全局变量
    app.use(async (ctx, next) => {
        global.globalConfig = {};
        Object.assign(global.globalConfig, {
            ctx: ctx,
            nowTime: +new Date(),
            // 数据库能暴露给客户端的字段，当查询条件用
            iconRepoExportFields: 'repoId iconPrefix repoName createTime iconIds fontPath ownerId',
            iconExportFields: 'iconId iconName iconContent ownerId',
            iconDraftExportFields: 'iconId iconName iconContent',
            userExportFields: 'userId userName nickName repos avatar'
        });
        await next();
    });

    // 文件上传multiple/from-data 解析到req.body
    app.use(koaBody({
        multipart: true,
        urlencoded: true
    }));

    // 请求参数解析
    app.use(bodyParser());

    app.use(KoaStatic(path.join(__dirname, 'public'), {}));

    await startServe();

    app.listen(config.ICON_APP_PORT, () => {
        log.debug(`app listen on port ${config.ICON_APP_PORT} ...`);
    });

    app.on('error', (err) => {
        log.error(err);
        process.exit(1);
    })
}

start();
