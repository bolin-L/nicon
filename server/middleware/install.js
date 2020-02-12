const responseFormat = require('../util/responseFormat');
let fileUtil = require('../util/fileUtil');
let log = require('../util/log');
const childProcess = require('child_process');
let path = require('path');
let startFilePath = path.resolve(__dirname, '../../bin/start.sh');

module.exports = function () {
    return async function (ctx) {
        if (ctx.originalUrl === '/api/install') {
            ctx.body = responseFormat.responseFormat(200, 'restart application', true);
            let params = ctx.request.body;
            let existService = ['default', 'default_qiniu', 'github_default', 'github_qiniu'];
            let productType = 'default';
            let paramStr = '';
            // 环境变量配置
            params.config.forEach(item => {
                if (item.name === 'productType') {
                    productType = item.value;
                }
                paramStr += `export ${item.name}='${item.value}'; #${item.description} \n`;
            });
            await fileUtil.createFile(startFilePath, `${paramStr}npm run restart;\n`);

            // 登录上传服务
            if (existService.indexOf(productType) === -1) {
                let loginRootPath = path.resolve(__dirname, `../service/login/${productType}`);
                let uploadRootPath = path.resolve(__dirname, `../service/upload/${productType}`);

                // 登录
                if (params.login.index && params.login.config) {
                    await fileUtil.createDirector(loginRootPath);
                    await fileUtil.createFile(path.resolve(loginRootPath, './index.js'), params.login.index);
                    await fileUtil.createFile(path.resolve(loginRootPath, './config.js'), params.login.config);
                }

                // 上传
                if (params.upload.index && params.upload.config) {
                    await fileUtil.createDirector(uploadRootPath);
                    await fileUtil.createFile(path.resolve(uploadRootPath, './index.js'), params.upload.index);
                    await fileUtil.createFile(path.resolve(uploadRootPath, './config.js'), params.upload.config);
                }
            }
            childProcess.exec(`sh ${startFilePath}`, (err) => {
                if (err) {
                    log.error(`exec error: ${err}`);
                }
            })
        } else {
            ctx.body = responseFormat.responseFormat(0, 'config params to install application', {});
        }
    }
};
