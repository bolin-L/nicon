let validator = {
    userName: [
        {
            type: 'isRequired',
            message: '请填写手机号码'
        },
        {
            type: 'isMobilePhone',
            message: '请填写正确的手机号码'
        }
    ],
    password: [
        {
            type: 'isRequired',
            message: '请填写密码'
        }
    ]
}

module.exports = validator;
