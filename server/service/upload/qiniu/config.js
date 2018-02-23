let pe = process.env;

module.exports = {
    accessKey: pe.QINIU_UPLOAD_ACCESS_KEY,
    secretKey: pe.QINIU_UPLOAD_SECRET_KEY,
    bucket: pe.QINIU_UPLOAD_BUCKET,
    cdnHost: pe.QINIU_UPLOAD_CDN_HOST
};
