'use strict'

const sqlite = require('better-sqlite3')
let db = new sqlite('../sql/metro.db')

const Contract = require('./Contract.js').Contract

class Advertiser
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM advertiser WHERE id=?').get(name)

        Object.defineProperty(this, "contracts", {
            get: function() {
                const res = db.prepare('SELECT id FROM advertising_contract WHERE advertiser_id=?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Contract(arr[i].id))
                return res
            }
        })
    }

    getAdvertisements = () => {
        let res = []
        for (c of contracts)
            res.push(c.advertisement)
        return res
    }
}
