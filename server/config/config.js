let path = require('path');
let host = process.env.productHost || 'icon.bolin.site';
module.exports = {
    productType: process.env.productType || 'default',
    url: `http://${host}`,
    host: `${host}`,
    ICON_APP_PORT: process.env.ICON_APP_PORT || 4843,
    rootRepoPath: path.resolve(__dirname, '../../public/resource/repository'),
    salt: 'NXArUDVwNlg1cGl2NUxpcTVhU241YmlGNllDOA==',
    autoLoginSessionExpires: 7 * 24 * 60 * 60 * 1000, // 7天
    defaultExpiresTime: +new Date('01-Jan-1970 00:00:10')
};
