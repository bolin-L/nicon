// 计数集合实现

module.exports = {
    model: String, // model的名称，modelName是保留字
    field: String, // 自增的字段
    seq: {type: Number, default: 0} // 该字段的计数
};
