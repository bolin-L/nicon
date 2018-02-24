let config = require('./config');
let path = require('path');
let fileUtil = require('../../../util/fileUtil');
let cryptoUtil = require('../../../util/cryptoUtil');
let stringUtil = require('../../../util/stringUtil');
let qiniu = require('qiniu');

class QiniuUpload {
    async upload (dirPath) {
        let fontMap = await this.uploadFonts(dirPath);
        // 上传font完毕后替换css中的引用
        let cssContent = await this.replaceFontsInCss(dirPath, fontMap);
        let cssUrl = await this.uploadCss(dirPath, cssContent);
        return {url: cssUrl, cssContent: cssContent};
    }

    /**
     * 读取图标库生成的font文件到nos
     *
     * @param    {String}           dirPath                     图标库文件夹路径
     * @return   {Object}                                       字体文件nos链接的key=value对象
     */
    async uploadFonts (dirPath = '') {
        let fontDirPath = path.join(dirPath, './fonts');
        let fontFiles = await fileUtil.readDirector(fontDirPath);
        let fontMap = {};

        for (let font of fontFiles) {
            let fileExt = font.match(/.*\.(\w+)$/)[1];
            let fontPath = path.join(fontDirPath, font);
            let fontContent = await fileUtil.readFile(fontPath);
            let uc = this.getUploadConfig(fontPath, cryptoUtil.md5(fontContent) + '.' + fileExt);
            fontMap[fileExt] = config.cdnHost + '/' + await this.qiniuUpload(uc);
        }
        return fontMap;
    }

    getUploadConfig (localFile, key) {
        let mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
        let options = {
            scope: config.bucket
        };
        let putPolicy = new qiniu.rs.PutPolicy(options);
        let uploadToken = putPolicy.uploadToken(mac);
        let uploadConfig = new qiniu.conf.Config();
        uploadConfig.zone = qiniu.zone.Zone_z0;
        let formUploader = new qiniu.form_up.FormUploader(uploadConfig);
        let putExtra = new qiniu.form_up.PutExtra();
        return {
            localFile,
            key,
            uploadToken,
            formUploader,
            putExtra
        }
    }

    async qiniuUpload (options) {
        return new Promise(function (resolve) {
            options.formUploader.putFile(options.uploadToken, options.key, options.localFile, options.putExtra,
                function (respErr, respBody, respInfo) {
                    if (respErr) {
                        throw new Error(respErr);
                    }
                    if (respInfo.statusCode === 200) {
                        resolve(respBody.key);
                    } else {
                        console.log(respInfo.statusCode);
                        console.log(respBody);
                    }
                });
        })
    }

    /**
     * 替换css文件中的字体文件引用
     *
     * @param    {Object}           fontMap                     字体文件nos链接的key=value对象
     * @param    {String}           dirPath                     图标库文件夹路径
     * @return   {void}
     */
    async replaceFontsInCss (dirPath = '', fontMap = {}) {
        let cssDirPath = path.join(dirPath, './css');
        let cssFiles = await fileUtil.readDirector(cssDirPath);
        let cssPath = path.join(dirPath, './css/' + (cssFiles[0] || 'icons.css'));
        let cssContent = await fileUtil.readFile(cssPath, {encoding: 'utf8'});
        cssContent = stringUtil.replaceParams(cssContent, fontMap);
        await fileUtil.createFile(cssPath, cssContent);
        return cssContent;
    }

    /**
     * 图标库生成的css链接
     *
     * @param    {String}           dirPath                     图标库文件夹路径
     * @return   {String}                                       css文件的nos链接
     */
    async uploadCss (dirPath, cssContent) {
        let cssDirPath = path.join(dirPath, './css');
        let cssFiles = await fileUtil.readDirector(cssDirPath);
        let cssPath = path.join(dirPath, './css/' + (cssFiles[0] || 'icons.css'));
        let uc = this.getUploadConfig(cssPath, cryptoUtil.md5(cssContent) + '.css');
        return config.cdnHost + '/' + await this.qiniuUpload(uc);
    }
}

let uploadIns = new QiniuUpload();
module.exports = uploadIns.upload.bind(uploadIns);
