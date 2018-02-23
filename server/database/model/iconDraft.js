// 字体图标信息表

module.exports = {
    iconId: {type: Number, unique: true}, // 字体图标Id, 唯一
    iconName: String, // 字体图标名称
    iconOriginContent: String, // 字体图标原内容
    iconContent: String, // 字体图标显示内容
    svgPath: String, // svg绘制path
    ownerId: Number, // 归属者用户Id
    createTime: Date, // 创建时间
    updateTime: Date // 最后更新时间
};
