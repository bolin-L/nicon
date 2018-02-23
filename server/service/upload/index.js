let config = require('../../config/config')

module.exports = {
    upload: require(`./${config.productType}`),
    config: require(`./${config.productType}/config`)
};
