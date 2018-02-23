let config = require('../../config/config');

module.exports = {
    login: require(`./${config.productType}`),
    config: require(`./${config.productType}/config`)
};
