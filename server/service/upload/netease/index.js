/**
 * 字体图标输出方式
 *
 */
let Upload2NosService = require('./upload2NosService');
let upload2NosServiceIns = new Upload2NosService();

class NeteaseUpload {
    async upload (dirPath) {
        return await upload2NosServiceIns.output2Nos(dirPath);
    }
}

let uploadIns = new NeteaseUpload();
module.exports = uploadIns.upload.bind(uploadIns);
