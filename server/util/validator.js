/* eslint-disable */
const validatorUtil =  require('./validatorUtil');

module.exports =  {
    validate (value, rules) {
        let conclusion = {
                success: true,
                message: ""
            },
            success = true,
            rule;

        if(!rules || rules.length == 0){
            return conclusion;
        }

        for(let i = 0, len = rules.length; i < len; i++){
            rule = rules[i];

            switch (rule.type){
                case 'is':
                    success = rule.reg.test(value);//个性化的正则表达式校验
                    break;
                case 'isRequired':
                    success = !!validatorUtil.toString(value);
                    break;
                case 'isFilled':
                    success = !!validatorUtil.toString(value).trim();
                    break;
                case 'isEmail':
                    success = validatorUtil.isEmail(value);
                    break;
                case 'isMobilePhone':
                    success = validatorUtil.isMobilePhone(value, 'zh-CN');
                    break;
                case 'isURL':
                    success = validatorUtil.isURL(value);
                    break;
                case 'isNumber':
                    success = validatorUtil.isInt(value, rule);  //同int
                    break;

                case 'isId':
                    success = validatorUtil.isId(value); //isInt 的首位不能为0， isID可以
                    break;
                case 'isInt':
                    success = validatorUtil.isInt(value, rule);
                    break;
                case 'isFloat':
                    success = validatorUtil.isFloat(value, rule);
                    break;
                case 'isSoftDecimal2':
                    success = validatorUtil.isSoftDecimal2(value, rule.min, rule.max);
                    break;
                case 'isLength':
                    success = validatorUtil.isLength(value, rule.min, rule.max);
                    break;
                default:
                    if(!rule.method){
                        conclusion = {
                            success: false,
                            message: "找不到此规则的校验方法"
                        }
                    }else {
                        success = rule.method(val); //个性化函数,校验特定的变量+特定规则
                    }
                    break;
            }
            if(!success || !conclusion.success){
                conclusion.message = rule.message || conclusion.message;
                conclusion.success = false;
                break; // 有错误则跳出
            }
        }

        return conclusion;
    },

    /**
     * 校验参数字段是否完整，验证数据完整性
     *
     * @param    {Object}           params                      post请求参数对象
     * @param    {Array}            rules                       校验字段对象
     * @param    {Object}           ctx                         请求对象
     * @return   {void}
     */
    validateParamsField (params, rules, ctx) {
        for (let key of Object.keys(params)) {
            let conslution = this.validate(params[key], rules[key]);
            if (!conslution.success) {
                ctx.body = responseFormat.responseFormat(200, conslution.message, false);
                return;
            }
        }
    }
}
