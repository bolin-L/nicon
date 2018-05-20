const fs = require('fs');
const SVGO = require('svgo');
let rimraf = require('rimraf');
let mkdirp = require('mkdirp');

const svgo = new SVGO({
    plugins: [{
        cleanupAttrs: true,
    }, {
        removeDoctype: true,
    }, {
        removeXMLProcInst: true,
    }, {
        removeComments: true,
    }, {
        removeMetadata: true,
    }, {
        removeTitle: true,
    }, {
        removeDesc: true,
    }, {
        removeUselessDefs: true,
    }, {
        removeEditorsNSData: true,
    }, {
        removeEmptyAttrs: true,
    }, {
        removeHiddenElems: true,
    }, {
        removeEmptyText: true,
    }, {
        removeEmptyContainers: true,
    }, {
        removeViewBox: false,
    }, {
        cleanUpEnableBackground: true,
    }, {
        convertStyleToAttrs: true,
    }, {
        convertColors: true,
    }, {
        convertPathData: true,
    }, {
        convertTransform: true,
    }, {
        removeUnknownsAndDefaults: true,
    }, {
        removeNonInheritableGroupAttrs: true,
    }, {
        removeUselessStrokeAndFill: true,
    }, {
        removeUnusedNS: true,
    }, {
        cleanupIDs: true,
    }, {
        cleanupNumericValues: true,
    }, {
        moveElemsAttrsToGroup: true,
    }, {
        moveGroupAttrsToElems: true,
    }, {
        collapseGroups: true,
    }, {
        removeRasterImages: false,
    }, {
        mergePaths: true,
    }, {
        convertShapeToPath: true,
    }, {
        sortAttrs: true,
    }, {
        transformsWithOnePath: false,
    }, {
        removeDimensions: true,
    }, {
        removeAttrs: {attrs: '(stroke|fill)'},
    }]
});

module.exports = {
    /**
     * 递归创建文件夹
     *
     * @param    {String}       fPath        文件夹路径
     * @return   {Object}                   成功对象
     */
    async createDirector (fPath) {
        if (!fPath) {
            throw new Error('file fPath error');
        }
        await mkdirp.sync(fPath);
        return true;
    },

    /**
     * 读取文件夹中的所有文件
     *
     * @param    {String}           fPath                        文件夹路径
     * @param    {Object}           options                     读取配置
     * @return   {Array}                                        文件夹下的文件数组
     */
    async readDirector (fPath, options) {
        if (!fPath) {
            throw new Error('file fPath error')
        }
        return await fs.readdirSync(fPath, options)
    },

    /**
     * 读取文件夹中的文件
     *
     * @param    {String}           fPath                        文件夹路径
     * @param    {Object}           options                     读取配置
     * @return   {Object}           data                        文件内容
     */
    async readFile (fPath, options = {}) {
        if (!fPath || !await this.exists(fPath)) {
            throw new Error('file fPath error')
        }
        return await fs.readFileSync(fPath, options);
    },

    /**
     * 删除文件夹中的文件
     *
     * @param    {String}       fPath       文件夹路径
     * @return   {Object}       promise
     */
    async deleteFile (fPath) {
        if (!fPath) {
            throw new Error('file fPath error')
        }
        if (this.exists(fPath)) {
            return await fs.unlinkSync(fPath);
        } else {
            return true;
        }
    },

    /**
     * 删除文件夹中的文件
     *
     * @param    {String}       fPath       文件夹路径
     * @return   {Object}       promise
     */
    async deleteDirector (fPath) {
        if (!fPath) {
            throw new Error('file fPath error')
        }
        await rimraf.sync(fPath);
        return true;
    },

    /**
     * 创建文件
     *
     * @param    {String}           fPath                        文件路径
     * @param    {String}           content                     文件内容
     * @param    {String}           encode                      文件编码
     * @return   {void}
     */
    async createFile (fPath, content, encode = 'utf8') {
        if (!fPath) {
            throw new Error('file fPath error')
        }
        return await fs.writeFileSync(fPath, content, encode);
    },

    /**
     * 删除文件夹中的文件
     *
     * @param    {String}       fPath       文件夹路径
     */
    async exists (fPath) {
        let result = await fs.existsSync(fPath);
        return !!result;
    },

    /**
     * 对svg内容进行处理
     *
     * @param    {String}       content       文件内容
     * @param    {Boolean}      resetColor    重置颜色
     * @return   {Object}       处理后的对象
     */
    async formatSvgFile (content, resetColor = true) {
        // 添加style
        if (/style=\"\S*\"/.test(content)) {
            content = content.replace(/style="(.*?)"/, 'style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"');
        } else {
            content = content.replace(/<svg/, '<svg style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"');
        }

        let result = await svgo.optimize(content);
        if (resetColor) {
            result.data = result.data.replace(/fill=".*?"/g, 'fill="currentColor"');
            result.data = result.data.replace(/stroke=".*?"/g, 'stroke="currentColor"');
        }
        // 把宽高加到viewBox中
        if (result.data.indexOf('viewBox=') === -1 && result.info.width && result.info.height) {
            result.data = result.data.replace(/<svg/, `<svg viewBox="0 0 ${result.info.width} ${result.info.height}"`);
        }

        // todo 需要把svg统一格式，重新绘制
        return {
            svgPath: content,
            iconContent: result.data,
            iconOriginContent: content
        }
    }
}
