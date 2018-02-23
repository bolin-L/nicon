// 后端返回数据格式定义
// 后端操作成功
// {
//     code: 0,
//     result: true | Array | Object | ...
//     message: ""
// }

// 后端操作失败|验证不通过
// {
//     code: 0,
//     result: false | null
//     message: "后端返回的错误信息，由前端上层toast或弹框显示或input框报错"
// }

// 后端操作失败|验证不通过
// {
//     code: 0,
//     result: false | null
//     message: {fieldName: {message: "后端返回的错误信息，由前端上层toast或弹框显示或input框报错", success: false}}
// }

// 后端操作通用提示
// {
//     code: 100, 101,
//     result: null
//     message: "后端返回的错误信息，统一toast处理"
// }

// 后端操作通用提示
// {
//     code: 500|501|502|503|504|505, // 内部错误
//     result: null
//     message: "后端返回的错误信息，统一弹框处理"
// }

// 后端操作通用提示
// {
//     code: 401,
//     result: null
//     message: "后端返回的错误信息，统一弹登录框处理"
// }

// 后端操作通用提示
// {
//     code: 403,
//     result: null
//     message: "后端返回的错误信息，统一弹框处理"
// }

function responseFormat (code, message, result) {
    return {
        code: code,
        message: message,
        result: result
    }
}

function responseFormatList (code, message, result, query) {
    let ret = {
        list: result,
        query: {}
    };
    Object.assign(ret.query, query, {
        totalPageCount: Math.ceil(query.totalCount / query.pageSize)
    });
    return {
        code: code,
        message: message,
        result: ret
    }
}

module.exports = { responseFormat, responseFormatList };
