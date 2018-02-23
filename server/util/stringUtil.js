/**
 * 字符串相关方法
 *
 */
module.exports = {
    /**
     * 替换字符串中指定的标记
     *
     * @param    {Object}           param                       数据对象
     * @param    {String}           str                         需要替换的字符串
     * @return   {String}                                       替换后的字符串
     */
    replaceParams (str = '', param = {}) {
        let reg0 = /\{(.*?)}/gi;
        let reg1 = /:([^-/|.]*)/gi;

        return str.replace(reg0, function ($0, $1) {
            return param[$1] ? param[$1] : $0;
        }).replace(reg1, function ($0, $1) {
            return param[$1] ? param[$1] : $0;
        });
    }
};
