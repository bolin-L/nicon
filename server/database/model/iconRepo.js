// 字体图标库信息表

module.exports = {
    repoId: {type: Number, unique: true}, // 字体图标库Id, 唯一
    repoUrl: String, // 字体图标库git地址
    repoName: String, // 字体图标库名称
    repoDescription: String, // 字体图标库描述
    iconPrefix: {type: String}, // 字体图标前缀
    fontPath: String, // css文件中引用字体文件的路径
    createTime: Date, // 创建时间
    updateTime: Date, // 最后更新时间
    isPublic: Boolean, // 是否公开
    unSync: Boolean, // 是否有未更新
    cssUrl: String, // css的nos链接
    cssContent: String, // css的内容
    svgSpriteContent: String, // svgSprite的内容
    iconIds: [
        {
            iconId: {type: Number},
            iconName: {type: String}
        }
    ],
    ownerId: Number // 归属者用户Id
};
