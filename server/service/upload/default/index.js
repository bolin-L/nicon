let config = require('../../../config/config');
let path = require('path');
let fileUtil = require('../../../util/fileUtil');
let stringUtil = require('../../../util/stringUtil');

class DefaultUpload {
    async upload (dirPath) {
        let fontMap = await this.uploadFonts(dirPath);
        // 上传font完毕后替换css中的引用
        let cssContent = await this.replaceFontsInCss(dirPath, fontMap);
        let cssNosUrl = await this.uploadCss(dirPath);
        return {url: cssNosUrl, cssContent: cssContent};
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
            let fontPath = path.join(fontDirPath, font).replace(__dirname, '');
            fontMap[fileExt] = fontPath.replace(`${process.cwd()}/public`, `//${config.host}`);
        }
        return fontMap;
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
    async uploadCss (dirPath) {
        let cssDirPath = path.join(dirPath, './css');
        let cssFiles = await fileUtil.readDirector(cssDirPath);
        let cssPath = path.join(dirPath, './css/' + (cssFiles[0] || 'icons.css'));
        return cssPath.replace(`${process.cwd()}/public`, `//${config.host}`);
    }
}

let uploadIns = new DefaultUpload();
module.exports = uploadIns.upload.bind(uploadIns);
