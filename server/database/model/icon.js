// 字体图标信息表

module.exports = {
    iconId: {type: Number, unique: true}, // 字体图标Id, 唯一
    iconName: {type: String}, // 字体图标名称
    iconContent: String, // 字体图标内容
    ownerId: Number, // 归属者用户Id
    createTime: Date, // 创建时间
    updateTime: Date // 最后更新时间
};
