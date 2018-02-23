/**
 * 字体图标CURD Controller
 *
 */

let responseFormat = require('../util/responseFormat');
let db = require('../database');
let log = require('../util/log');
let incUtil = require('../util/incUtil');

class IconController {
    constructor (config) {
        this.config = config;
    }

    /**
     * 保存字体图标到数据库
     *
     * @param    {String}           iconName                    字体图标名称
     * @param    {String}           iconContent                 svg的xml内容字符串
     * @param    {Object}           userInfo                    用户基本信息
     * @return   {Object}                                       字体图标完整信息对象
     */
    async saveIcon (iconName, iconContent, userInfo) {
        // 获取唯一自增Id
        let iconId = await incUtil.getIncId({model: 'icon', field: 'iconId'});

        // 构建完整数据
        let iconData = {
            iconName: iconName.replace('.svg', ''),
            iconContent: iconContent,
            createTime: global.globalConfig.nowTime,
            updateTime: global.globalConfig.nowTime,
            ownerId: userInfo.userId,
            iconId: iconId
        };

        let iconAddResult = (await db.icon.add(iconData));
        return iconAddResult.toObject();
    }

    /**
     * 获取各种条件下的字体图标列表
     *
     * @param    {Object}           ctx                     请求对象
     * @return   {void}
     */
    async getIconList (ctx) {
        let params = ctx.params;
        let query = Object.assign({
            pageIndex: 1,
            pageSize: 20
        }, ctx.request.query);
        let iconIds = [];
        let result = [];
        query.q = new RegExp(`.*${query.q || ''}.*`);

        // 获取仓库下的字体图标Id数组, 倒序
        if (query.repoId) {
            iconIds = (await this.getRepoIconIds(query, query.unique) || []).reverse();
        }

        if (!query.unique && !query.repoId) {
            // 获取用户的所有字体图标列表
            if (params.userId === 'all') {
                result = await this.getAllIconList(query);
            } else {
                result = await this.getIconListByUserId(params, query);
            }
        } else if (query.unique) {
            // 判断当前用户不起作用
            // await auth();
            // 获取用户的所有字体图标列表,过滤掉当前图标库已经有的
            result = await this.getIconListNotInRepoByUnique(params, query, iconIds)
        } else {
            // 获取该图标库下的所有字体图标列表
            result = await this.getIconListByRepoId(query.repoId, query, iconIds);
        }

        ctx.body = responseFormat.responseFormatList(200, '', result, query);
    }

    /**
     * 获取该仓库下所有字体图标的iconId数组
     *
     * @param    {Object}           query                       request query
     * @param    {Boolean}          notFilter                  get all icons of repoId
     * @return   {Array}                                        字体图标数组
     */
    async getRepoIconIds (query, notFilter) {
        let iconRepoItem = await db.iconRepo.findOne({
            repoId: query.repoId
        });
        if (!notFilter) {
            iconRepoItem.iconIds = iconRepoItem.iconIds.filter((icon) => {
                return icon.iconName.match(query.q);
            });
        }
        return iconRepoItem.iconIds.map((icon) => {
            return icon.iconId
        });
    }

    /**
     * 获取当前用户的字体图标列表
     *
     * @param    {Object}           userInfo                    用户基本信息
     * @param    {Object}           query                       请求参数对象
     * @return   {Array}                                        字体图标对象数组
     */
    async getIconListByUserId (userInfo, query) {
        let result = await db.icon.find({
            ownerId: userInfo.userId,
            iconName: query.q
        }, global.globalConfig.iconExportFields,
        {
            limit: parseInt(query.pageSize),
            skip: parseInt((query.pageIndex - 1) * query.pageSize),
            sort: {
                createTime: -1
            }
        }
        );
        query.totalCount = await db.icon.count({
            ownerId: userInfo.userId,
            iconName: query.q
        });
        return result;
    }

    /**
     * 获取当前用户的字体图标列表
     *
     * @param    {Object}           userInfo                    用户基本信息
     * @param    {Object}           query                       请求参数对象
     * @return   {Array}                                        字体图标对象数组
     */
    async getAllIconList (query) {
        let result = await db.icon.find({
            iconName: query.q
        }, global.globalConfig.iconExportFields,
        {
            limit: parseInt(query.pageSize),
            skip: parseInt((query.pageIndex - 1) * query.pageSize),
            sort: {
                createTime: -1
            }
        }
        );
        query.totalCount = await db.icon.count({
            iconName: query.q
        });
        return result;
    }

    /**
     * 获取当前图标库下的字体图标列表
     *
     * @param    {Number}           repoId                  图标库Id
     * @param    {Object}           query                       请求参数对象
     * @param    {Array}            iconIds                     字体图标id数组
     * @return   {Array}                                        字体图标对象数组
     */
    async getIconListByRepoId (repoId, query, iconIds) {
        let result = [];
        for (let i = (query.pageIndex - 1) * query.pageSize || 0; i < Math.min(iconIds.length, query.pageIndex * query.pageSize); i++) {
            let iconItem = await db.icon.findOne({
                iconId: iconIds[i]
            }, global.globalConfig.iconExportFields
            );
            result.push(iconItem)
        }
        query.totalCount = iconIds.length;
        return result;
    }

    /**
     * 获取当前用户的字体图标列表
     *
     * @param    {Object}           userInfo                    用户基本信息
     * @param    {Object}           query                       请求参数对象
     * @param    {Array}            iconIds                     字体图标id数组
     * @return   {Array}                                        字体图标对象数组
     */
    async getIconListNotInRepoByUnique (userInfo, query, iconIds) {
        let result = await db.icon.find({
            ownerId: userInfo.userId,
            iconId: {
                $nin: iconIds
            },
            iconName: query.q
        }, global.globalConfig.iconExportFields,
        {
            limit: parseInt(query.pageSize),
            skip: parseInt((query.pageIndex - 1) * query.pageSize),
            sort: {
                createTime: -1
            }
        }
        );
        query.totalCount = await db.icon.count({
            ownerId: userInfo.userId,
            iconId: {
                $nin: iconIds
            },
            iconName: query.q
        });
        return result;
    }

    /**
     * 删除字体图标
     *
     * @param    {Object}           ctx                     请求对象
     * @return   {void}
     */
    async deleteIcon (ctx) {
        let userInfo = ctx.userInfo;
        let params = ctx.params;
        let iconItem = await db.icon.findOne({
            iconId: params.iconId
        });
        if (!iconItem) {
            ctx.body = responseFormat.responseFormat(500, '无此图标！', false);
            return;
        }
        // check privilege
        if (userInfo.userId !== iconItem.ownerId) {
            ctx.body = responseFormat.responseFormat(403, '无权限', false);
            return;
        }

        // check dependence
        let iconRelationshipItem = await db.iconBelongToRepo.findOne({
            iconId: params.iconId
        });

        if (iconRelationshipItem && iconRelationshipItem.repos.length > 0) {
            let message = '该图标已经加入图标库: ';
            for (let repo of iconRelationshipItem.repos) {
                message += repo.repoName + '、';
            }
            message += ', 请移除后再删除！';
            ctx.body = responseFormat.responseFormat(500, message, false);
            return;
        }

        // delete icon
        await db.icon.delete({
            ownerId: userInfo.userId,
            iconId: params.iconId
        });
        log.debug(`user ${userInfo.userId} delete icon ${params.iconId}`);
        ctx.body = responseFormat.responseFormat(200, '删除成功！', false);
    }

    /**
     * 下载字体图标
     *
     * @param    {Object}           ctx                     请求对象
     * @return   {void}
     */
    async downloadIcon (ctx) {
        let params = ctx.params || {};
        let iconItem = await db.icon.findOne({
            iconId: params.iconId
        });
        if (!iconItem) {
            ctx.body = responseFormat.responseFormat(200, '无此图标！', false);
            return;
        }
        // 强制客户端直接下载svg headers
        ctx.set('Content-Type', 'application/force-download');
        ctx.set('Content-disposition', 'attachment; filename=' + iconItem.iconName + '.svg');
        ctx.body = iconItem.iconContent;
    }
};

module.exports = IconController;
