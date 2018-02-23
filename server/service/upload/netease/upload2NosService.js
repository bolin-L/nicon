/**
 * 把生成的css、font上传到nos
 *
 */
let NosService = require('./nosService');
let nosServiceIns = new NosService();
let cryptoUtil = require('../../../util/cryptoUtil');
let fileUtil = require('../../../util/fileUtil');
let path = require('path');
let stringUtil = require('../../../util/stringUtil');

class Upload2NosService {
    /**
     * 上传图标库生成的font文件到nos
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
            fontMap[fileExt] = await nosServiceIns.upload(fontPath, cryptoUtil.md5(fontContent) + '.' + fileExt);
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
        let cssPath = path.join(dirPath, './css/icons.css');
        let cssContent = await fileUtil.readFile(cssPath, {encoding: 'utf8'});
        cssContent = stringUtil.replaceParams(cssContent, fontMap);
        await fileUtil.createFile(cssPath, cssContent);
        return cssContent;
    }

    /**
     * 上传图标库生成的css文件到nos
     *
     * @param    {String}           dirPath                     图标库文件夹路径
     * @return   {String}                                       css文件的nos链接
     */
    async uploadCss (dirPath) {
        let cssPath = path.join(dirPath, './css/icons.css');
        let cssContent = await fileUtil.readFile(cssPath);
        return await nosServiceIns.upload(cssPath, cryptoUtil.md5(cssContent) + '.css', {contentType: 'text/css'});
    }

    /**
     * 功能
     *
     * @param    {String}           dirPath                     图标库文件夹路径
     * @return   {Object}                                       css文件的nos链接对象
     */
    async output2Nos (dirPath) {
        let fontMap = await this.uploadFonts(dirPath);
        // 上传font完毕后替换css中的引用
        let cssContent = await this.replaceFontsInCss(dirPath, fontMap);
        let cssNosUrl = await this.uploadCss(dirPath);
        return {url: cssNosUrl, cssContent: cssContent};
    }
};

module.exports = Upload2NosService;
