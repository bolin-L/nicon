/* eslint-disable */

let validatorUtil = { version: '4.5.2' };

let emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
let quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;

let emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
let quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;

let displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;

let creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

let isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;

let isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/
    , isbn13Maybe = /^(?:[0-9]{13})$/;

let macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

let ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
    , ipv6Block = /^[0-9A-F]{1,4}$/i;

let uuid = {
    '3': /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i
    , '4': /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    , '5': /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    , all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

let alpha = /^[A-Z]+$/i
    , alphanumeric = /^[0-9A-Z]+$/i
    , numeric = /^[-+]?[0-9]+$/
    , int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/
    , float = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
    , hexadecimal = /^[0-9A-F]+$/i
    , decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/
    , hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i
    , id = /^[0-9]+$/; //纯数字没有加减号，想不到更好的名字了

let ascii = /^[\x00-\x7F]+$/
    , multibyte = /[^\x00-\x7F]/
    , fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/
    , halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

let surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

let base64 = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;

let phones = {
    'zh-CN': /^(\+?0?86\-?)?((13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[0589]\d{7})$/,
    'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
    'en-ZA': /^(\+?27|0)\d{9}$/,
    'en-AU': /^(\+?61|0)4\d{8}$/,
    'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
    'fr-FR': /^(\+?33|0)[67]\d{8}$/,
    'pt-PT': /^(\+351)?9[1236]\d{7}$/,
    'el-GR': /^(\+?30)?(69\d{8})$/,
    'en-GB': /^(\+?44|0)7\d{9}$/,
    'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
    'en-ZM': /^(\+26)?09[567]\d{7}$/,
    'ru-RU': /^(\+?7|8)?9\d{9}$/,
    'nb-NO': /^(\+?47)?[49]\d{7}$/,
    'nn-NO': /^(\+?47)?[49]\d{7}$/,
    'vi-VN': /^(0|\+?84)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
    'en-NZ': /^(\+?64|0)2\d{7,9}$/,
    'en-IN': /^(\+?91|0)?[789]\d{9}$/
};

// from http://goo.gl/0ejHHW
let iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

function merge(obj, defaults) {
    obj = obj || {};
    for (let key in defaults) {
        if (typeof obj[key] === 'undefined') {
            obj[key] = defaults[key];
        }
    }
    return obj;
}

function currencyRegex(options) {
    let symbol = '(\\' + options.symbol.replace(/\./g, '\\.') + ')' + (options.require_symbol ? '' : '?')
        , negative = '-?'
        , whole_dollar_amount_without_sep = '[1-9]\\d*'
        , whole_dollar_amount_with_sep = '[1-9]\\d{0,2}(\\' + options.thousands_separator + '\\d{3})*'
        , valid_whole_dollar_amounts = ['0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep]
        , whole_dollar_amount = '(' + valid_whole_dollar_amounts.join('|') + ')?'
        , decimal_amount = '(\\' + options.decimal_separator + '\\d{2})?';
    let pattern = whole_dollar_amount + decimal_amount;
    // default is negative sign before symbol, but there are two other options (besides parens)
    if (options.allow_negatives && !options.parens_for_negatives) {
        if (options.negative_sign_after_digits) {
            pattern += negative;
        }
        else if (options.negative_sign_before_digits) {
            pattern = negative + pattern;
        }
    }
    // South African Rand, for example, uses R 123 (space) and R-123 (no space)
    if (options.allow_negative_sign_placeholder) {
        pattern = '( (?!\\-))?' + pattern;
    }
    else if (options.allow_space_after_symbol) {
        pattern = ' ?' + pattern;
    }
    else if (options.allow_space_after_digits) {
        pattern += '( (?!$))?';
    }
    if (options.symbol_after_digits) {
        pattern += symbol;
    } else {
        pattern = symbol + pattern;
    }
    if (options.allow_negatives) {
        if (options.parens_for_negatives) {
            pattern = '(\\(' + pattern + '\\)|' + pattern + ')';
        }
        else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
            pattern = negative + pattern;
        }
    }
    return new RegExp(
        '^' +
        // ensure there's a dollar and/or decimal amount, and that it doesn't start with a space or a negative sign followed by a space
        '(?!-? )(?=.*\\d)' +
        pattern +
        '$'
    );
}


/* --------- 自定义添加的规则 ---------- */
let num_decimal2 = /^\+?(\d*(\.\d{1,2})?)$/;

/**
 * 数字 并且 最多两位小数, 并且大于min 小于等于max
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isSoftDecimal2
 * @param  {Number} num 传入的数值
 * @param  {Number} [min=0] 数值区间的最小值,默认为0
 * @param  {Number} max 数值区间的最大值
 * @return {Boolean}
 */
validatorUtil.isSoftDecimal2 = function (num, min, max) {
    min = min | 0;
    return num_decimal2.test(num) && (parseFloat(num) > min) && (max ? parseFloat(num) <= max: true);
};


validatorUtil.extend = function (name, fn) {
    validatorUtil[name] = function () {
        let args = Array.prototype.slice.call(arguments);
        args[0] = validatorUtil.toString(args[0]);
        return fn.apply(validatorUtil, args);
    };
};

//Right before exporting the validatorUtil object, pass each of the builtins
//through extend() so that their first argument is coerced to a string
validatorUtil.init = function () {
    for (let name in validatorUtil) {
        if (typeof validatorUtil[name] !== 'function' || name === 'toString' ||
            name === 'toDate' || name === 'extend' || name === 'init') {
            continue;
        }
        validatorUtil.extend(name, validatorUtil[name]);
    }
};

/**
 * 转换成字符串
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#toString
 * @param  {String} input 传入的数值
 * @return {String}
 */
validatorUtil.toString = function (input) {
    if (typeof input === 'object' && input !== null && input.toString) {
        input = input.toString();
    } else if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
        input = '';
    }
    return '' + input;
};

/**
 * 转换成时间
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#toDate
 * @param  {String} date 传入的数值
 * @return {Date}
 */
validatorUtil.toDate = function (date) {
    if (Object.prototype.toString.call(date) === '[object Date]') {
        return date;
    }
    date = Date.parse(date);
    return !isNaN(date) ? new Date(date) : null;
};

/**
 * 转换成Float数值
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#toFloat
 * @param  {String} str 传入的值
 * @return {Boolean}
 */
validatorUtil.toFloat = function (str) {
    return parseFloat(str);
};

/**
 * 校验输入的字是否在控制的区间之内
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#inputTips
 * @param  {String} str 传入的值
 * @param  {String} [min=0] 最小值
 * @param  {String} max 最大值
 * @param  {String} [afterText='个字'] 后缀显示的单位
 * @return {{success: Boolean, message: String}}
 */
validatorUtil.inputTips = function(str, min, max, isRealTime, afterText){
    min = min || 0;
    //结尾文字
    afterText = afterText || '个字';

    let len = Math.ceil(validatorUtil.getStrLength(str.trim())/2),
        defaultStatus = {
            message: '',
            success: true
        };

    if(len < min){
        return {
            message: "至少输入" + (min) + afterText,
            success: false
        }
    }else if(len > max) {  //_max undefined 则不进入
        return {
            message: "超出" + (len - max) + afterText,
            success: false
        }
    }else if(isRealTime && max){  //如果要实时输出还可以输入几个字
        return {
            message: "还可以输入" + (max - len) + afterText,
            success: true
        }
    }

    return defaultStatus;
};

/**
 * 转换数值为Int
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#toInt
 * @param  {String} num 传入的数值
 * @param  {number} [radix=10] 进制
 * @return {number}
 */
validatorUtil.toInt = function (num, radix) {
    return parseInt(num, radix || 10);
};

/**
 * 转换数值为bool值
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#toBoolean
 * @param  {String} str 传入的数值
 * @param  {Boolean} [strict=10] 是否强制模式,强制模式下返回只判断str==='1'||str==='true'
 * @return {Boolean}
 */
validatorUtil.toBoolean = function (str, strict) {
    if (strict) {
        return str === '1' || str === 'true';
    }
    return str !== '0' && str !== 'false' && str !== '';
};
/**
 * 对比comparison转换为字符串后的内容是否和str一致
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#equals
 * @param  {String} str 传入的数值
 * @param  {String} comparison 比对的内容
 * @return {Boolean}
 */
validatorUtil.equals = function (str, comparison) {
    return str === validatorUtil.toString(comparison);
};
/**
 * 判断str是否包含elem
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#contains
 * @param  {String} str
 * @param  {String} elem
 * @return {Boolean}
 */
validatorUtil.contains = function (str, elem) {
    return str.indexOf(validatorUtil.toString(elem)) >= 0;
};
/**
 * 正则判断
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#matches
 * @param  {String} str 输入的内容
 * @param  {String} pattern 正则表达式
 * @param  {String} modifiers 正则表达式的参数
 * @return {Boolean}
 */
validatorUtil.matches = function (str, pattern, modifiers) {
    if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
        pattern = new RegExp(pattern, modifiers);
    }
    return pattern.test(str);
};

let default_email_options = {
    allow_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true
};
/**
 * 判断是否是邮件格式
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isEmail
 * @param  {String} str 输入的内容
 * @param  {String} options
 * @param  {String} [options.allow_display_name=false] If allow_display_name is set to true, the validatorUtil will also match Display Name <email-address>
 * @param  {String} [options.allow_utf8_local_part=true] f allow_utf8_local_part is set to false, the validatorUtil will not allow any non-English UTF8 character in email address' local part.
 * @param  {String} [options.require_tld=true]  If require_tld is set to false, e-mail addresses without having TLD in their domain will also be matched.
 * @return {Boolean}
 */
validatorUtil.isEmail = function (str, options) {
    options = merge(options, default_email_options);

    if (options.allow_display_name) {
        let display_email = str.match(displayName);
        if (display_email) {
            str = display_email[1];
        }
    }

    let parts = str.split('@')
        , domain = parts.pop()
        , user = parts.join('@');

    let lower_domain = domain.toLowerCase();
    if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
        user = user.replace(/\./g, '').toLowerCase();
    }

    if (!validatorUtil.isByteLength(user, {max: 64}) ||
        !validatorUtil.isByteLength(domain, {max: 256})) {
        return false;
    }

    if (!validatorUtil.isFQDN(domain, {require_tld: options.require_tld})) {
        return false;
    }

    if (user[0] === '"') {
        user = user.slice(1, user.length - 1);
        return options.allow_utf8_local_part ?
            quotedEmailUserUtf8.test(user) :
            quotedEmailUser.test(user);
    }

    let pattern = options.allow_utf8_local_part ?
        emailUserUtf8Part : emailUserPart;

    let user_parts = user.split('.');
    for (let i = 0; i < user_parts.length; i++) {
        if (!pattern.test(user_parts[i])) {
            return false;
        }
    }

    return true;
};

let default_url_options = {
    protocols: [ 'http', 'https', 'ftp' ]
    , require_tld: true
    , require_protocol: false
    , require_valid_protocol: true
    , allow_underscores: false
    , allow_trailing_dot: false
    , allow_protocol_relative_urls: false
};

/**
 * 判断是否是url
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isURL
 * @param  {String} url 输入的内容
 * @param  {String} options
 * @return {Boolean}
 */
validatorUtil.isURL = function (url, options) {
    if (!url || url.length >= 2083 || /\s/.test(url)) {
        return false;
    }
    if (url.indexOf('mailto:') === 0) {
        return false;
    }
    options = merge(options, default_url_options);
    let protocol, auth, host, hostname, port,
        port_str, split;
    split = url.split('://');
    if (split.length > 1) {
        protocol = split.shift();
        if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
            return false;
        }
    } else if (options.require_protocol) {
        return false;
    }  else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
        split[0] = url.substr(2);
    }
    url = split.join('://');
    split = url.split('#');
    url = split.shift();

    split = url.split('?');
    url = split.shift();

    split = url.split('/');
    url = split.shift();
    split = url.split('@');
    if (split.length > 1) {
        auth = split.shift();
        if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
            return false;
        }
    }
    hostname = split.join('@');
    split = hostname.split(':');
    host = split.shift();
    if (split.length) {
        port_str = split.join(':');
        port = parseInt(port_str, 10);
        if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
            return false;
        }
    }
    if (!validatorUtil.isIP(host) && !validatorUtil.isFQDN(host, options) &&
        host !== 'localhost') {
        return false;
    }
    if (options.host_whitelist &&
        options.host_whitelist.indexOf(host) === -1) {
        return false;
    }
    if (options.host_blacklist &&
        options.host_blacklist.indexOf(host) !== -1) {
        return false;
    }
    return true;
};

/**
 * 判断是否是MACAddress
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isMACAddress
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isMACAddress = function (str) {
    return macAddress.test(str);
};

/**
 * 判断是否是isIP
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isIP
 * @param  {String} str 输入的内容
 * @param  {String} version ipv版本 4或者6
 * @return {Boolean}
 */
validatorUtil.isIP = function (str, version) {
    version = validatorUtil.toString(version);
    if (!version) {
        return validatorUtil.isIP(str, 4) || validatorUtil.isIP(str, 6);
    } else if (version === '4') {
        if (!ipv4Maybe.test(str)) {
            return false;
        }
        let parts = str.split('.').sort(function (a, b) {
            return a - b;
        });
        return parts[3] <= 255;
    } else if (version === '6') {
        let blocks = str.split(':');
        let foundOmissionBlock = false; // marker to indicate ::

        // At least some OS accept the last 32 bits of an IPv6 address
        // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
        // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
        // and '::a.b.c.d' is deprecated, but also valid.
        let foundIPv4TransitionBlock = validatorUtil.isIP(blocks[blocks.length - 1], 4);
        let expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

        if (blocks.length > expectedNumberOfBlocks)
            return false;

        // initial or final ::
        if (str === '::') {
            return true;
        } else if (str.substr(0, 2) === '::') {
            blocks.shift();
            blocks.shift();
            foundOmissionBlock = true;
        } else if (str.substr(str.length - 2) === '::') {
            blocks.pop();
            blocks.pop();
            foundOmissionBlock = true;
        }

        for (let i = 0; i < blocks.length; ++i) {
            // test for a :: which can not be at the string start/end
            // since those cases have been handled above
            if (blocks[i] === '' && i > 0 && i < blocks.length -1) {
                if (foundOmissionBlock)
                    return false; // multiple :: in address
                foundOmissionBlock = true;
            } else if (foundIPv4TransitionBlock && i == blocks.length - 1) {
                // it has been checked before that the last
                // block is a valid IPv4 address
            } else if (!ipv6Block.test(blocks[i])) {
                return false;
            }
        }

        if (foundOmissionBlock) {
            return blocks.length >= 1;
        } else {
            return blocks.length === expectedNumberOfBlocks;
        }
    }
    return false;
};

let default_fqdn_options = {
    require_tld: true
    , allow_underscores: false
    , allow_trailing_dot: false
};

/**
 * 判断是否是FQDN
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isFQDN
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isFQDN = function (str, options) {
    options = merge(options, default_fqdn_options);

    /* Remove the optional trailing dot before checking validity */
    if (options.allow_trailing_dot && str[str.length - 1] === '.') {
        str = str.substring(0, str.length - 1);
    }
    let parts = str.split('.');
    if (options.require_tld) {
        let tld = parts.pop();
        if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
            return false;
        }
    }
    for (let part, i = 0; i < parts.length; i++) {
        part = parts[i];
        if (options.allow_underscores) {
            if (part.indexOf('__') >= 0) {
                return false;
            }
            part = part.replace(/_/g, '');
        }
        if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
            return false;
        }
        if (/[\uff01-\uff5e]/.test(part)) {
            // disallow full-width chars
            return false;
        }
        if (part[0] === '-' || part[part.length - 1] === '-') {
            return false;
        }
        if (part.indexOf('---') >= 0 && part.slice(0, 4) !== 'xn--') {
            return false;
        }
    }
    return true;
};

/**
 * 判断是否是Bool值
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isBoolean
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isBoolean = function(str) {
    return (['true', 'false', '1', '0'].indexOf(str) >= 0);
};

/**
 * 判断是否是字母
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isAlpha
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isAlpha = function (str) {
    return alpha.test(str);
};

/**
 * 判断是否是字母或数字
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isAlphanumeric
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isAlphanumeric = function (str) {
    return alphanumeric.test(str);
};

/**
 * 判断是否是数字
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isNumeric
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isNumeric = function (str) {
    return numeric.test(str);
};

/**
 * 判断是否是10进制数字
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isDecimal
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isDecimal = function (str) {
    return str !== '' && decimal.test(str);
};

/**
 * 判断是否是16进制数字
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isHexadecimal
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isHexadecimal = function (str) {
    return hexadecimal.test(str);
};

/**
 * 判断是否是16进制颜色值
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isHexColor
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isHexColor = function (str) {
    return hexcolor.test(str);
};

/**
 * 判断是否是小写
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isLowercase
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isLowercase = function (str) {
    return str === str.toLowerCase();
};

/**
 * 判断是否是大写
 *
 * @public
 * @method module:pool/component-validation/src/util/validatorUtil.Validator#isUppercase
 * @param  {String} str 输入的内容
 * @return {Boolean}
 */
validatorUtil.isUppercase = function (str) {
    return str === str.toUpperCase();
};

validatorUtil.isInt = function (str, options) {
    options = options || {};
    return int.test(str) && (!options.hasOwnProperty('min') || (+str) >= options.min) && (!options.hasOwnProperty('max') || (+str) <= options.max);
};

validatorUtil.isId = function (str) {
    return id.test(str);
};

validatorUtil.isFloat = function (str, options) {
    options = options || {};
    if (str === '' || str === '.') {
        return false;
    }
    return float.test(str) && (!options.hasOwnProperty('min') || str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max);
};

validatorUtil.isDivisibleBy = function (str, num) {
    return validatorUtil.toFloat(str) % validatorUtil.toInt(num) === 0;
};

validatorUtil.isNull = function (str) {
    return str.length === 0;
};

validatorUtil.isLength = function (str, options) {
    let min, max;
    if (typeof(options) === 'object') {
        min = options.min || 0;
        max = options.max;
    } else { // backwards compatibility: isLength(str, min [, max])
        min = arguments[1] || 0;
        max = arguments[2];
    }

    let len = validatorUtil.getStrLength(str.trim())/2;
    return (Math.floor(len) >= min) && (typeof max === 'undefined' || Math.ceil(len) <= max);
};
validatorUtil.isByteLength = function (str, options) {
    let min, max;
    if (typeof(options) === 'object') {
        min = options.min || 0;
        max = options.max;
    } else { // backwards compatibility: isByteLength(str, min [, max])
        min = arguments[1] || 0;
        max = arguments[2];
    }
    let len = encodeURI(str).split(/%..|./).length - 1;
    return len >= min && (typeof max === 'undefined' || len <= max);
};

validatorUtil.isUUID = function (str, version) {
    let pattern = uuid[version ? version : 'all'];
    return pattern && pattern.test(str);
};

function getTimezoneOffset(str) {
    let iso8601Parts = str.match(iso8601)
        , timezone, sign, hours, minutes;
    if (!iso8601Parts) {
        str = str.toLowerCase();
        timezone = str.match(/(?:\s|gmt\s*)(-|\+)(\d{1,4})(\s|$)/);
        if (!timezone) {
            return str.indexOf('gmt') !== -1 ? 0 : null;
        }
        sign = timezone[1];
        let offset = timezone[2];
        if (offset.length === 3) {
            offset = '0' + offset;
        }
        if (offset.length <= 2) {
            hours = 0;
            minutes = parseInt(offset);
        } else {
            hours = parseInt(offset.slice(0, 2));
            minutes = parseInt(offset.slice(2, 4));
        }
    } else {
        timezone = iso8601Parts[21];
        if (!timezone) {
            // if no hour/minute was provided, the date is GMT
            return !iso8601Parts[12] ? 0 : null;
        }
        if (timezone === 'z' || timezone === 'Z') {
            return 0;
        }
        sign = iso8601Parts[22];
        if (timezone.indexOf(':') !== -1) {
            hours = parseInt(iso8601Parts[23]);
            minutes = parseInt(iso8601Parts[24]);
        } else {
            hours = 0;
            minutes = parseInt(iso8601Parts[23]);
        }
    }
    return (hours * 60 + minutes) * (sign === '-' ? 1 : -1);
}

validatorUtil.isDate = function (str) {
    let normalizedDate = new Date(Date.parse(str));
    if (isNaN(normalizedDate)) {
        return false;
    }

    // normalizedDate is in the user's timezone. Apply the input
    // timezone offset to the date so that the year and day match
    // the input
    let timezoneOffset = getTimezoneOffset(str);
    if (timezoneOffset !== null) {
        let timezoneDifference = normalizedDate.getTimezoneOffset() -
            timezoneOffset;
        normalizedDate = new Date(normalizedDate.getTime() +
            60000 * timezoneDifference);
    }

    let day = String(normalizedDate.getDate());
    let dayOrYear, dayOrYearMatches, year;
    //check for valid double digits that could be late days
    //check for all matches since a string like '12/23' is a valid date
    //ignore everything with nearby colons
    dayOrYearMatches = str.match(/(^|[^:\d])[23]\d([^:\d]|$)/g);
    if (!dayOrYearMatches) {
        return true;
    }
    dayOrYear = dayOrYearMatches.map(function(digitString) {
        return digitString.match(/\d+/g)[0];
    }).join('/');

    year = String(normalizedDate.getFullYear()).slice(-2);
    if (dayOrYear === day || dayOrYear === year) {
        return true;
    } else if ((dayOrYear === (day + '/' + year)) || (dayOrYear === (year + '/' + day))) {
        return true;
    }
    return false;
};

validatorUtil.isAfter = function (str, date) {
    let comparison = validatorUtil.toDate(date || new Date())
        , original = validatorUtil.toDate(str);
    return !!(original && comparison && original > comparison);
};

validatorUtil.isBefore = function (str, date) {
    let comparison = validatorUtil.toDate(date || new Date())
        , original = validatorUtil.toDate(str);
    return !!(original && comparison && original < comparison);
};

validatorUtil.isIn = function (str, options) {
    let i;
    if (Object.prototype.toString.call(options) === '[object Array]') {
        let array = [];
        for (i in options) {
            array[i] = validatorUtil.toString(options[i]);
        }
        return array.indexOf(str) >= 0;
    } else if (typeof options === 'object') {
        return options.hasOwnProperty(str);
    } else if (options && typeof options.indexOf === 'function') {
        return options.indexOf(str) >= 0;
    }
    return false;
};

validatorUtil.isWhitelisted = function (str, chars) {
    for (let i = str.length - 1; i >= 0; i--) {
        if (chars.indexOf(str[i]) === -1) {
            return false;
        }
    }

    return true;
};

validatorUtil.isCreditCard = function (str) {
    let sanitized = str.replace(/[^0-9]+/g, '');
    if (!creditCard.test(sanitized)) {
        return false;
    }
    let sum = 0, digit, tmpNum, shouldDouble;
    for (let i = sanitized.length - 1; i >= 0; i--) {
        digit = sanitized.substring(i, (i + 1));
        tmpNum = parseInt(digit, 10);
        if (shouldDouble) {
            tmpNum *= 2;
            if (tmpNum >= 10) {
                sum += ((tmpNum % 10) + 1);
            } else {
                sum += tmpNum;
            }
        } else {
            sum += tmpNum;
        }
        shouldDouble = !shouldDouble;
    }
    return !!((sum % 10) === 0 ? sanitized : false);
};

validatorUtil.isISIN = function (str) {
    if (!isin.test(str)) {
        return false;
    }

    let checksumStr = str.replace(/[A-Z]/g, function(character) {
        return parseInt(character, 36);
    });

    let sum = 0, digit, tmpNum, shouldDouble = true;
    for (let i = checksumStr.length - 2; i >= 0; i--) {
        digit = checksumStr.substring(i, (i + 1));
        tmpNum = parseInt(digit, 10);
        if (shouldDouble) {
            tmpNum *= 2;
            if (tmpNum >= 10) {
                sum += tmpNum + 1;
            } else {
                sum += tmpNum;
            }
        } else {
            sum += tmpNum;
        }
        shouldDouble = !shouldDouble;
    }

    return parseInt(str.substr(str.length - 1), 10) === (10000 - sum) % 10;
};

validatorUtil.isISBN = function (str, version) {
    version = validatorUtil.toString(version);
    if (!version) {
        return validatorUtil.isISBN(str, 10) || validatorUtil.isISBN(str, 13);
    }
    let sanitized = str.replace(/[\s-]+/g, '')
        , checksum = 0, i;
    if (version === '10') {
        if (!isbn10Maybe.test(sanitized)) {
            return false;
        }
        for (i = 0; i < 9; i++) {
            checksum += (i + 1) * sanitized.charAt(i);
        }
        if (sanitized.charAt(9) === 'X') {
            checksum += 10 * 10;
        } else {
            checksum += 10 * sanitized.charAt(9);
        }
        if ((checksum % 11) === 0) {
            return !!sanitized;
        }
    } else  if (version === '13') {
        if (!isbn13Maybe.test(sanitized)) {
            return false;
        }
        let factor = [ 1, 3 ];
        for (i = 0; i < 12; i++) {
            checksum += factor[i % 2] * sanitized.charAt(i);
        }
        if (sanitized.charAt(12) - ((10 - (checksum % 10)) % 10) === 0) {
            return !!sanitized;
        }
    }
    return false;
};

validatorUtil.isMobilePhone = function(str, locale) {
    if (locale in phones) {
        return phones[locale].test(str);
    }
    return false;
};

let default_currency_options = {
    symbol: '$'
    , require_symbol: false
    , allow_space_after_symbol: false
    , symbol_after_digits: false
    , allow_negatives: true
    , parens_for_negatives: false
    , negative_sign_before_digits: false
    , negative_sign_after_digits: false
    , allow_negative_sign_placeholder: false
    , thousands_separator: ','
    , decimal_separator: '.'
    , allow_space_after_digits: false
};

validatorUtil.isCurrency = function (str, options) {
    options = merge(options, default_currency_options);

    return currencyRegex(options).test(str);
};

validatorUtil.isJSON = function (str) {
    try {
        let obj = JSON.parse(str);
        return !!obj && typeof obj === 'object';
    } catch (e) {
        /* continue regardless of error */
    }
    return false;
};

validatorUtil.isMultibyte = function (str) {
    return multibyte.test(str);
};

validatorUtil.isAscii = function (str) {
    return ascii.test(str);
};

validatorUtil.isFullWidth = function (str) {
    return fullWidth.test(str);
};

validatorUtil.isHalfWidth = function (str) {
    return halfWidth.test(str);
};

validatorUtil.isVariableWidth = function (str) {
    return fullWidth.test(str) && halfWidth.test(str);
};

validatorUtil.isSurrogatePair = function (str) {
    return surrogatePair.test(str);
};

validatorUtil.isBase64 = function (str) {
    return base64.test(str);
};

validatorUtil.isMongoId = function (str) {
    return validatorUtil.isHexadecimal(str) && str.length === 24;
};

validatorUtil.isISO8601 = function (str) {
    return iso8601.test(str);
};

validatorUtil.ltrim = function (str, chars) {
    let pattern = chars ? new RegExp('^[' + chars + ']+', 'g') : /^\s+/g;
    return str.replace(pattern, '');
};

validatorUtil.rtrim = function (str, chars) {
    let pattern = chars ? new RegExp('[' + chars + ']+$', 'g') : /\s+$/g;
    return str.replace(pattern, '');
};

validatorUtil.trim = function (str, chars) {
    let pattern = chars ? new RegExp('^[' + chars + ']+|[' + chars + ']+$', 'g') : /^\s+|\s+$/g;
    return str.replace(pattern, '');
};

validatorUtil.escape = function (str) {
    return (str.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;')
        .replace(/\`/g, '&#96;'));
};

validatorUtil.stripLow = function (str, keep_new_lines) {
    let chars = keep_new_lines ? '\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F' : '\\x00-\\x1F\\x7F';
    return validatorUtil.blacklist(str, chars);
};

validatorUtil.whitelist = function (str, chars) {
    return str.replace(new RegExp('[^' + chars + ']+', 'g'), '');
};

validatorUtil.blacklist = function (str, chars) {
    return str.replace(new RegExp('[' + chars + ']+', 'g'), '');
};

let default_normalize_email_options = {
    lowercase: true,
    remove_dots: true,
    remove_extension: true
};

validatorUtil.normalizeEmail = function (email, options) {
    options = merge(options, default_normalize_email_options);
    if (!validatorUtil.isEmail(email)) {
        return false;
    }
    let parts = email.split('@', 2);
    parts[1] = parts[1].toLowerCase();
    if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
        if (options.remove_extension) {
            parts[0] = parts[0].split('+')[0];
        }
        if (options.remove_dots) {
            parts[0] = parts[0].replace(/\./g, '');
        }
        if (!parts[0].length) {
            return false;
        }
        parts[0] = parts[0].toLowerCase();
        parts[1] = 'gmail.com';
    } else if (options.lowercase) {
        parts[0] = parts[0].toLowerCase();
    }
    return parts.join('@');
};

validatorUtil.getStrLength = function (str) {
    str = str || '';
    str = str.replace(/^\n+|\n+$/g, ""); //将富文本中\n过滤
    var entryLen0 = str.length,
        entryLen = 0;
    var cnChar = str.match(/[^\x00-\x80]/g); //利用match方法检索出中文字符并返回一个存放中文的数组
    if (!!cnChar && cnChar.length > 0)
        entryLen = cnChar.length || 0; //算出实际的字符长度
    return entryLen0 + entryLen;
}

validatorUtil.init();

module.exports = validatorUtil;

