const Redis = require('ioredis');
const redisConfig = require('../config/redisConfig');
const { Store } = require('koa-session2');
const cryptoUtil = require('../util/cryptoUtil');
const log = require('../util/log');

class RedisStore extends Store {
    constructor () {
        super();
        this.redis = new Redis(redisConfig);
        this.redis.on('connect', () => {
            log.debug(`connect redis success`);
        })
    }

    async get (sid, salt, ctx) {
        let data = await this.redis.get(`SESSION:${sid}`) || null;
        // log.debug(`[%s.get] get session success, sid: ${sid}`, this.constructor.name);
        return JSON.parse(data);
    }

    async set (session, { sid = cryptoUtil.encrypt(session), maxAge = 100000000 } = {}, ctx) {
        try {
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
            log.debug(`[%s.set] set session success, sid: ${sid}`, this.constructor.name);
        } catch (e) {
            throw new Error(e);
        }
        return sid;
    }

    async destroy (sid, ctx) {
        log.debug(`destroy session ${sid}`);
        return await this.redis.del(`SESSION:${sid}`);
    }
}

module.exports = new RedisStore();
