/**
 * icon repo Controller
 *
 */
let config = require('../config/config');
let constant = require('../config/constant');
let responseFormat = require('../util/responseFormat');
let repoInfoRules = require('../validation/repoInfoRules');
let validator = require('../util/validator');
let db = require('../database');
let log = require('../util/log');
let path = require('path');
let fileUtil = require('../util/fileUtil');
let incUtil = require('../util/incUtil');
let icon = require('../tool/icon');
let svgSprite = require('../tool/svgSprite');
let uploadService = require('../service/upload');

class RepoController {
    /**
     * add icon repo
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async addRepo (ctx) {
        let params = ctx.request.body || {};
        let userInfo = ctx.userInfo;

        // validate completely
        validator.validateParamsField(params, repoInfoRules, ctx);

        // validate unique
        await this.iconRepoExist(params, userInfo);

        // get increment repoId
        let repoId = await incUtil.getIncId({model: 'iconRepo', field: 'repoId'});

        // build repo data
        Object.assign(params, {
            createTime: global.globalConfig.nowTime,
            updateTime: global.globalConfig.nowTime,
            ownerId: userInfo.userId,
            repoId: repoId
        });
        log.debug(`add repo data: ${JSON.stringify(params)}`);

        // save icon repo data to database
        await db.iconRepo.add(params);

        // add repoId to owner repos field
        await db.user.update({
            userId: userInfo.userId
        }, {
            $push: {
                'repos': {
                    repoId: repoId,
                    repoName: params.repoName
                }
            }
        });

        ctx.body = responseFormat.responseFormat(200, 'save success!', true);
    }

    /**
     * add icon repo
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async updateRepoInfo (ctx) {
        let data = ctx.request.body || {};
        let params = ctx.params;
        let userInfo = ctx.userInfo;

        // validate completely
        validator.validateParamsField(params, repoInfoRules, ctx);

        // validate privilege, only owner
        let repoItem = await db.iconRepo.findOne({
            ownerId: userInfo.userId,
            repoId: params.repoId
        });

        if (!repoItem) {
            throw new Error('no privilege!');
        }

        // validate unique
        // await this.iconRepoExist(data, userInfo);

        // build repo data
        data = Object.assign(repoItem, data, {
            updateTime: global.globalConfig.nowTime,
            ownerId: userInfo.userId,
            unSync: true,
            repoId: parseInt(params.repoId)
        });
        log.debug(`user ${userInfo.userId} update repo data: ${JSON.stringify(params)}`);

        // update icon repo data to database
        await db.iconRepo.update({repoId: params.repoId}, data);

        // add repoId to owner repos field, todo
        // await db.user.update({
        //     userId: userInfo.userId
        // }, {
        //     "$set": {
        //         "repos.$[element]": {
        //             repoId: params.repoId,
        //             repoName: data.repoName
        //         }
        //     }
        // }, {
        //     arrayFilters: [{
        //         repoId: params.repoId,
        //         repoName: repoItem.repoName
        //     }]
        // });

        ctx.body = responseFormat.responseFormat(200, 'save success!', true);
    }

    /**
     * get repo list
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async getRepoList (ctx) {
        let params = ctx.params;
        let query = ctx.request.query || {};
        let repoList = [];

        if (parseInt(params.userId)) {
            repoList = await this.getRepoListByUserId(params, query, ctx);
        } else {
            repoList = await this.getAllRepoList(query)
        }
        ctx.body = responseFormat.responseFormatList(200, '', repoList, query);
    }

    /**
     * get all repo list
     *
     * @param    {Object}           query                   pagination object
     * @return   {void}
     */
    async getAllRepoList (query) {
        let result = await db.iconRepo.find(
            {}, global.globalConfig.iconRepoExportFields,
            {
                limit: parseInt(query.pageSize),
                skip: parseInt((query.pageIndex - 1) * query.pageSize)
            }
        );
        query.totalCount = await db.iconRepo.count({});
        log.debug(`get all repos and count: ${query.totalCount}`);
        // traverse repo list for finding icon that belong to repo
        for (let i = 0; i < (result || []).length; i++) {
            result[i].icons = [];
            result[i].iconCount = (result[i].iconIds || []).length;
            for (let j = 0; j < Math.min(result[i].iconIds.length, constant.REPO_LIST_CONTAIN_ICON_COUNT_PER_REPO); j++) {
                let iconItem = await db.icon.findOne(
                    {
                        iconId: result[i].iconIds[j].iconId
                    }, global.globalConfig.iconExportFields);
                result[i].icons.push(iconItem || {});
            }
        }
        return result;
    }

    /**
     * get repo list of specific user
     *
     * @param    {Object}           params                  query object of url
     * @param    {Object}           query                   pagination object
     * @return   {void}
     */
    async getRepoListByUserId (params, query) {
        let userItem = await db.user.findOne(
            {
                userId: params.userId
            }
        );

        query.totalCount = userItem.repos.length;
        log.debug(`get user ${params.userId} repo list and count: ${query.totalCount}`);
        let repoList = [];
        for (let r = (query.pageIndex - 1) * query.pageSize; r < Math.min((query.pageIndex) * query.pageSize, userItem.repos.length); r++) {
            let repoItem = await db.iconRepo.findOne({
                repoId: userItem.repos[r].repoId
            }, global.globalConfig.iconRepoExportFields);

            // traverse repo list for finding icon that belong to repo
            repoItem.icons = [];
            repoItem.iconCount = (repoItem.iconIds || []).length;
            for (let j = 0; j < Math.min(repoItem.iconIds.length, constant.REPO_LIST_CONTAIN_ICON_COUNT_PER_REPO); j++) {
                let iconItem = await db.icon.findOne(
                    {
                        iconId: repoItem.iconIds[j].iconId
                    }, global.globalConfig.iconExportFields);
                repoItem.icons.push(iconItem || {});
            }
            repoList.push(repoItem);
        }
        return repoList;
    }

    /**
     * get repo info
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async getRepoInfo (ctx) {
        let userInfo = ctx.userInfo;
        let params = ctx.params;
        // find info first
        let result = await db.iconRepo.findOne(
            {
                repoId: params.repoId
            }
        );
        // pre login
        if (userInfo.userId) {
            // check user has repoId in repos field
            let userItem = await db.user.findOne({
                userId: userInfo.userId
            });
            // isMember if exist repoId
            userItem.repos.forEach((item) => {
                if (item.repoId === parseInt(params.repoId)) {
                    result.isMember = true;
                }
            });
            // is owner if repo's ownerId equal to userId
            if (result.ownerId === userInfo.userId) {
                result.isOwner = true;
            }
        }

        ctx.body = responseFormat.responseFormat(200, '', result);
    }

    /**
     * get repo css or svg resource
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async getRepoResource (ctx) {
        let params = ctx.params;
        let type = (ctx.request.query || {}).type;
        // find info first
        let repoItem = await db.iconRepo.findOne(
            {
                repoId: params.repoId
            }
        );
        // pre login
        let result = null;
        if (repoItem) {
            // type can be cssUrl or cssContent
            if (repoItem[type]) {
                result = repoItem[type]
            } else {
                let iconIds = await this.getRepoIconIds(repoItem.repoId);
                result = [];
                for (let iconId of iconIds) {
                    let iconItem = await db.icon.findOne({iconId: iconId});
                    result.push({
                        iconId: iconItem.iconId,
                        iconContent: iconItem.iconContent,
                        iconName: iconItem.iconName
                    })
                }
            }
        }

        ctx.body = responseFormat.responseFormat(200, '', result);
    }

    /**
     * get iconIds that belong to repo
     *
     * @param    {Number}           repoId                  repoId
     * @return   {Array}                                    all iconIds that belong to repo
     */
    async getRepoIconIds (repoId) {
        let iconRepoItem = await db.iconRepo.findOne({
            repoId: repoId
        });
        let iconIds = [];
        iconRepoItem.iconIds.map((icon) => {
            iconIds.push(icon.iconId)
        });
        return iconIds;
    }

    /**
     * add iconId to repo's iconIds field
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async addIcon2Repo (ctx) {
        let params = ctx.request.body || {};
        let userInfo = ctx.userInfo;

        // judge unique from upload icons
        let tmpMap = {};
        for (let icon of params.icons) {
            if (tmpMap[icon.iconName]) {
                throw new Error(`upload repeat icon ${icon.iconName}`);
            }
            tmpMap[icon.iconName] = true;
        }

        // has privilege or not
        let userItem = await db.user.findOne({
            userId: userInfo.userId
        });
        if (!userItem || !this.hasRepo(userItem.repos, params.repoId)) {
            throw new Error('no privilege!');
        }
        let repoItem = await db.iconRepo.findOne({
            repoId: params.repoId
        });
        // judge unique to avoid repeat between upload and database
        for (let icon of params.icons) {
            for (let existIcon of repoItem.iconIds) {
                if (icon.iconId === existIcon.iconId || icon.iconName === existIcon.iconName) {
                    throw new Error(`repo ${repoItem.repoName} has contain icon ${icon.iconName}`)
                }
            }
        }
        // add many icon one times, need to traverse
        for (let icon of params.icons) {
            await db.iconRepo.update({
                repoId: params.repoId
            }, {
                $push: {
                    'iconIds': {
                        iconId: icon.iconId,
                        iconName: icon.iconName
                    }
                },
                unSync: true
            });
            log.debug(`user ${userInfo.userId} add icon ${icon.iconId}-${icon.iconName} to repo ${params.repoId}`);

            await db.iconBelongToRepo.update({
                iconId: icon.iconId
            }, {
                iconId: icon.iconId,
                iconName: icon.iconName,
                $push: {
                    'repos': {
                        repoId: repoItem.repoId,
                        repoName: repoItem.repoName
                    }
                }
            }, {
                upsert: true
            })
        }

        ctx.body = responseFormat.responseFormat(200, 'add success!', true);
    }

    /**
     * is member or master of repoId
     *
     * @param    {Array}            repos                       repo array
     * @param    {Number}           repoId                      repo id
     * @return   {void}
     */
    hasRepo (repos = [], repoId) {
        for (let repo of repos) {
            if (repo.repoId === parseInt(repoId)) {
                return true;
            }
        }
        return false;
    }

    /**
     * delete iconId from repo
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async deleteIconFromRepo (ctx) {
        let params = ctx.params || {};
        let userInfo = ctx.userInfo;
        let isMember = false;

        // check user has repoId in repos field
        let userItem = await db.user.findOne({
            userId: userInfo.userId
        });
        // isMember if exist repoId
        userItem.repos.forEach((item) => {
            if (item.repoId === params.repoId) {
                isMember = true;
            }
        });

        if (!isMember) {
            ctx.body = responseFormat.responseFormat(403, 'no privilege!', false);
        }

        await db.iconRepo.update({
            repoId: params.repoId
        }, {
            $pull: {
                'iconIds': {
                    iconId: params.iconId
                }
            },
            unSync: true
        });
        // remove relationship for delete operation
        await db.iconBelongToRepo.update({
            iconId: params.iconId
        }, {
            $pull: {
                'repos': {
                    repoId: params.repoId
                }
            }
        });

        // remove svg file from resource
        let repoItem = await db.iconRepo.findOne({
            repoId: params.repoId
        });
        let iconItem = await db.icon.findOne({
            iconId: params.iconId
        });
        let iconPath = path.resolve(__dirname, `../../public/resource/repository/${repoItem.ownerId}-${repoItem.iconPrefix}/svg/${iconItem.iconName}.svg`);
        await fileUtil.deleteFile(iconPath);
        log.debug(`user ${userInfo.userId} delete icon ${params.iconId} from repo ${params.repoId}`);

        ctx.body = responseFormat.responseFormat(200, 'delete success!', true);
    }

    /**
     * sync database and generate css files
     *
     * @param    {Object}           ctx                         request object
     * @return   {void}
     */
    async syncRepo (ctx) {
        let params = ctx.params;
        let userInfo = ctx.userInfo;
        let isRepoMember = false;

        // judge privilege
        let userItem = await db.user.findOne({
            userId: userInfo.userId
        });
        userItem.repos.map((item) => {
            if (item.userId === params.userId) {
                isRepoMember = true;
            }
        });
        if (!isRepoMember) {
            ctx.body = responseFormat.responseFormat(403, 'no privilege!', false);
            return;
        }

        let repoItem = await db.iconRepo.findOne({
            repoId: params.repoId
        });
        // judge update or not
        if (repoItem.unSync) {
            let repoPath = path.join(config.rootRepoPath, `./${repoItem.ownerId}-${repoItem.iconPrefix}`);
            // clean all svg for avoid cache or change iconPrefix, maintain if default
            // if (config.productType === 'default') {
            //     await fileUtil.deleteDirector(repoPath);
            // }
            let repoSvgPath = path.join(repoPath, './svg/');
            let repoIcons = [];
            await fileUtil.createDirector(repoSvgPath);

            // create svg file recursive
            for (let k = 0; k < repoItem.iconIds.length; k++) {
                let iconItem = (await db.icon.findOne({
                    iconId: repoItem.iconIds[k].iconId
                }) || {});
                repoIcons.push(iconItem);
                await fileUtil.createFile(path.join(repoSvgPath, iconItem.iconName + '.svg'), iconItem.iconContent);
            }
            let uploadResult = {};
            let svgSpriteResult = '';
            // must has svg
            if (repoItem.iconIds.length > 0) {
                await icon.compileSvg2Icon(repoPath, repoItem.iconPrefix, repoItem.fontPath);
                // output to server and return css url and css content
                uploadResult = await uploadService.upload(repoPath);

                // svg sprite
                svgSpriteResult = svgSprite(repoItem.iconPrefix, repoIcons);
            } else {
                uploadResult = {url: '', cssContent: ''};
                svgSpriteResult = '';
            }
            // update sync status
            await db.iconRepo.update({
                repoId: params.repoId
            }, {
                unSync: false,
                cssUrl: uploadResult.url,
                cssContent: uploadResult.cssContent,
                svgSpriteContent: svgSpriteResult
            });
            log.debug(`user ${userInfo.userId} sync repo ${params.repoId} success`);

            // clean all svg for avoid cache or change iconPrefix, delete if access thirdly upload
            // if (config.productType !== 'default') {
            //     await fileUtil.deleteDirector(repoPath);
            // }
            ctx.body = responseFormat.responseFormat(200, 'update success!', uploadResult);
            return;
        }

        ctx.body = responseFormat.responseFormat(200, 'update success!', true);
    }

    /**
     * judge repo already exist
     *
     * @param    {Object}           params                      post request object
     * @param    {Object}           userInfo                    userInfo
     * @return   {void}
     */
    async iconRepoExist (params, userInfo) {
        let iconLibItem = await db.iconRepo.findOne({
            iconPrefix: params.iconPrefix,
            ownerId: userInfo.userId
        });

        if (iconLibItem) {
            throw new Error(`${params.iconPrefix} already exist！`)
        }
    }

    /**
     * add member of repo
     *
     * @param    {Object}           ctx                         request object
     * @return   {void}
     */
    async addMember (ctx) {
        let params = ctx.params;
        let userInfo = ctx.userInfo;
        let data = ctx.request.body || {};

        // only master can add member
        let repo = await db.iconRepo.findOne({
            ownerId: userInfo.userId,
            repoId: params.repoId
        });
        if (!repo) {
            ctx.body = responseFormat.responseFormat(403, 'no privilege！', false);
            return;
        }
        // user exist
        let user = null;
        if (parseInt(data.accountType) === constant.MEMBER_ACCOUNT_TYPE_USER_ID) {
            user = await db.user.findOne({
                userId: data.account
            });
        } else {
            user = await db.user.findOne({
                userName: data.account
            });
        }
        if (!user) {
            ctx.body = responseFormat.responseFormat(200, 'user not exist, make sure has login the site', false);
            return;
        }
        // add member of repo
        await db.user.update({
            userId: user.userId
        }, {
            $push: {
                'repos': {
                    repoId: repo.repoId,
                    repoName: repo.repoName
                }
            }
        });
        log.debug(`user ${userInfo.userId} add member ${user.userId} of repo ${repo.repoId}`)
        ctx.body = responseFormat.responseFormat(200, '添加成功！', true);
    }

    /**
     * get recommend repo list
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async getRecommendRepoList (ctx) {
        let recommendRepos = await db.repoRecommend.find({});
        let result = [];
        let query = ctx.request.query || {};
        // find all recommend repo
        for (let repo of recommendRepos) {
            let repoItem = await db.iconRepo.findOne({
                repoId: repo.repoId
            }, global.globalConfig.iconRepoExportFields, {
                lean: true
            });
            // traverse repo list for finding icon that belong to repo
            repoItem.icons = [];
            repoItem.iconCount = (repoItem.iconIds || []).length;
            for (let icon of repoItem.iconIds) {
                if (repoItem.icons.length >= constant.REPO_LIST_CONTAIN_ICON_COUNT_PER_REPO) {
                    break;
                }
                let iconItem = (await db.icon.findOne(
                    {
                        iconId: icon.iconId
                    }, global.globalConfig.iconExportFields) || {});
                repoItem.icons.push(iconItem);
            }
            result.push(repoItem)
        }

        ctx.body = responseFormat.responseFormatList(200, '', result, query);
    }

    /**
     * add recommend repo
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async addRecommendRepo (ctx) {
        let params = ctx.request.body || {};
        if (params.key === config.salt) {
            for (let item of params.repos) {
                let repo = await db.iconRepo.findOne({
                    repoId: item.repoId
                });
                if (repo) {
                    // get increment repoId
                    let id = await incUtil.getIncId({model: 'repoRecommend', field: 'id'});
                    await db.repoRecommend.add({
                        id: id,
                        repoId: repo.repoId
                    })
                }
            }
        }

        ctx.body = responseFormat.responseFormat(200, 'save success!', true);
    }

    /**
     * add recommend repo
     *
     * @param    {Object}           ctx                     request object
     * @return   {void}
     */
    async deleteRecommendRepo (ctx) {
        let params = ctx.request.body || {};

        if (params.key === config.salt) {
            for (let item of params.repos) {
                await db.repoRecommend.delete({
                    repoId: item.repoId
                })
            }
        }

        ctx.body = responseFormat.responseFormat(200, 'delete success!', true);
    }
};

module.exports = RepoController;
