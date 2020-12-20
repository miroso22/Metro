'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

const Contract = require('./Contract.js').Contract

class Advertiser
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM advertiser WHERE id=?').get(name)

        Object.defineProperty(this, "contracts", {
            get: function() {
                const ids = db.prepare('SELECT id FROM advertising_contract WHERE advertiser_id=?').all(this.name)
                const res = []
                ids.forEach(v => res.push(cache.contracts.has(v.id) ?
                                    res.get(cache.contracts.get(v.id)) :
                                    new Contract(arr[i].id)))
                return res
            }
        })

        cache.advertisers.set(this.name, this)
    }

    getAdvertisements = () => {
        let res = []
        for (c of contracts)
            res.push(c.advertisement)
        return res
    }
}
