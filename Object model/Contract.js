'use strict'

const db = require('./connector.js').db
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
                const res = db.prepare('SELECT id FROM advertisement WHERE contract_id=?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Advertisement(arr[i].id))
                return res
            }
        })
        Object.defineProperty(this, "advertiser", {
            get: function() {
                return new Advertiser(advertiserId)
            }
        })
    }
}
