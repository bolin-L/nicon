let pe = process.env;

module.exports = {
    port: pe.REDIS_PORT || 6379,
    host: pe.REDIS_HOST || '127.0.0.1',
    family: pe.REDIS_FAMILY || 4,
    password: pe.REDIS_PASSWORD || '',
    db: pe.REDIS_DB || 0
};
