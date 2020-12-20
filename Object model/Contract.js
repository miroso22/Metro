'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

const Advertisement = require('./Advertisement.js').Advertisement
const Advertiser = require('./Advertiser.js').Advertiser

class Contract
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM advertising_contract WHERE id=?').get(name)

        this.publishDate = data.publish_date
        this.expireDate = data.expire_date
        this.price = data.price
        this.wasAccepted = data.was_accepted
        this.advertiserId = data.advertiser_id

        Object.defineProperty(this, "advertisements", {
            get: function() {
                const ids = db.prepare('SELECT id FROM advertisement WHERE contract_id=?').all(this.name)
                const res = []
                ids.forEach(v => res.push(cache.advertisements.has(v.id) ?
                                            cache.advertisements.get(v.id) :
                                            new Advertisement(v.id)))
                return res
            }
        })
        Object.defineProperty(this, "advertiser", {
            get: function() {
                return cache.advertisers.has(advertiserId) ?
                            cache.advertisers.get(advertiserId) :
                            new Advertiser(advertiserId)
            }
        })

        cache.contracts.set(this.name, this)
    }
}
