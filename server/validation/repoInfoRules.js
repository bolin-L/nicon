let validator = {
    repoName: [
        {
            type: 'isRequired',
            message: '请填写仓库名称'
        }
    ],
    repoPrefix: [
        {
            type: 'isRequired',
            message: '请填写字体图标类型前缀'
        },
        {
            type: 'is',
            reg: new RegExp('\\w+'),
            message: '请填写正确格式的字体图标类型前缀'
        }
    ],
    repoDescription: [
        {
            type: 'isLength',
            message: '描述不能超过300字',
            min: 0,
            max: 300
        }
    ]
}

module.exports = validator;
