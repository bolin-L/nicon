let db = require('../database/index');
let _ = require('lodash');

/**
 * 获取自增Id
 *
 * @param   {Object}       query       查询字段对象
 * @return  {Integer}                  自增Id
 * @return  {Object}                   promise
 */
async function getIncId (query) {
    // 新版文档参数new为returnNewDoc, 返回更改后的对象
    let result = await db.counter.findOneAndUpdate(query, {$inc: {seq: _.random(10, 100)}}, {upsert: true, new: true, lean: true});
    if (!result) {
        // 随机返回一个数，防止错误
        return _.random(10000, 100000);
    } else {
        return result.seq;
    }
}

module.exports = { getIncId };
