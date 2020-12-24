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
        this.personalInfo = data.personalInfo

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

    deleteThis = () => db.prepare('DELETE FROM advertiser WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM advertiser WHERE id=?').run(name)
    updateThis = () =>
        db.prepare('UPDATE advertiser SET content=?, station_id=?, contract_id=? WHERE id=?')
          .run(this.content, this.stationId, this.contractId, this.name)
    static create = (name, personalInfo) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO advertiser(id,personal_info) VALUES(?, ?)')
              .run(name, personalInfo)
    static checkExist = name => db.prepare('SELECT * FROM advertiser WHERE id=?').get(name) != undefined

    getAdvertisements = () => {
        let res = []
        for (c of contracts)
            res.push(c.advertisement)
        return res
    }
}
