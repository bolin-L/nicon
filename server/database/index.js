let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const userModel = require('./model/user');
const iconModel = require('./model/icon');
const iconDraftModel = require('./model/iconDraft');
const iconLibModel = require('./model/iconRepo');
const counterModel = require('./model/counter');
const iconBelongToRepoModel = require('./model/iconBelongToRepo');
const repoRecommendModel = require('./model/repoRecommend');
class MongoDB {
    /**
     * 构造函数
     *
     * @param    {String}        name               集合名称
     * @param    {Object}        model              集合model模型
     * @return   {Object}                           集合对象
     */
    constructor (name, model) {
        if (!name || !model) {
            return;
        }
        this.model = this.schema(name, model);
    }

    /**
     * 单例模式，获取某一个collection对象
     * @param    {String}        name               集合名称
     * @param    {String}        model              数据模型
     * @return   {Object}                           集合对象
     */
    static getModel (name, model) {
        if (!!name && !!model) {
            return new this(name, model);
        }
    }

    /**
     * 添加记录，返回添加成功对象
     *
     * @param    {Object}        data               数据对象
     * @return   {Object}                           集合对象
     */
    async add (data) {
        return await this.model.create(data);
    }

    /**
     * 删除记录，返回添加成功对象
     *
     * @param    {Object}        data               数据对象
      */
    async delete (data) {
        return await this.model.remove(data);
    }

    /**
     * 更新记录，返回添加更新对象
     *
     * @param    {Object}        condition          查询条件
     * @param    {Object}        data               数据对象
     * @param    {Object}        options            更新配置
     * @return   {Object}                           集合对象
     */
    async update (condition, data, options = {}) {
        return await this.model.update(condition, data, options)
    }

    /**
     * 查找，返回对象数组
     *
     * @param    {Object}        data               查询条件
     * @param    {String}        fields             需要返回的字段, 多个字段空格分开，默认全部
     * @param    {Object}        options            选择配置{lean: true}
     * @return   {Object}                           集合对象
     */
    async find (data, fields = '', options = {}) {
        options = Object.assign({lean: true}, options);
        return await this.model.find(data, fields, options);
    }

    /**
     * 查找，返回第一个数据对象
     *
     * @param    {Object}        data               查询条件
     * @param    {String}        fields             需要返回的字段, 多个字段空格分开，默认全部
     * @param    {Object}        options            选择配置{lean: true}
     * @return   {Object}                           集合对象
     */
    async findOne (data, fields = '', options = {lean: true}) {
        let result = await this.model.find(data, fields, options);
        return (result[0] || null)
    }

    /**
     * 查找并更新，返回第一个数据对象
     *
     * @param    {Object}        data               查询条件
     * @param    {Object}        update             更新的字段
     * @param    {Object}        options            选择配置{lean: true}
     * @return   {Object}                           集合对象
     */
    async findOneAndUpdate (data, update, options = {lean: true}) {
        let result = await this.model.findOneAndUpdate(data, update, options);
        return (result || null)
    }

    /**
     * 查找该条件下的所有条目，返回数量
     *
     * @param    {Object}        data               查询条件
     * @param    {String}        fields             需要返回的字段, 多个字段空格分开，默认全部
     * @param    {Object}        options            选择配置{lean: true}
     * @return   {Object}                           集合对象
     */
    async count (data) {
        return await this.model.count(data);
    }

    /**
     * 生成mongoose collection实例
     *
     * @param    {String}        name               集合名称
     * @param    {Object}        model              集合model模型
     * @return   {Object}                           集合对象
     */
    schema (name, model) {
        let schema = new Schema(model);
        // 保证嵌套数组中 unique起作用
        return mongoose.model(name, schema);
    }
}

module.exports = {
    user: MongoDB.getModel('user', userModel),
    icon: MongoDB.getModel('icon', iconModel),
    iconRepo: MongoDB.getModel('iconRepo', iconLibModel),
    counter: MongoDB.getModel('counter', counterModel),
    iconDraft: MongoDB.getModel('iconDraft', iconDraftModel),
    iconBelongToRepo: MongoDB.getModel('iconBelongToRepo', iconBelongToRepoModel),
    repoRecommend: MongoDB.getModel('repoRecommend', repoRecommendModel)
};
