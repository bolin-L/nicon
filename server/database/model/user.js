// 用户个人信息表

module.exports = {
    userId: {type: Number, unique: true}, // 用户Id, 唯一
    userName: {type: String, unique: true}, // 用户名称, 唯一，账号
    nickName: String, // 昵称
    fullName: String, // 全名
    password: String, // 密码
    email: String, // 邮箱
    avatar: String, // 头像链接
    repos: [
        {
            repoId: {type: Number}, // 拥有的图标库Id
            repoName: String
        }
    ],
    createTime: Date, // 创建时间
    updateTime: Date // 最后更新时间
};
