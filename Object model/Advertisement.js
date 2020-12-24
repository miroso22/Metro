'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

const Contract = require('./Contract.js').Contract
const Station = require('./Station.js').Station

class Advertisement
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM advertisement WHERE id=?').get(name)

       this.content = data.content
       this.stationId = data.stationId
       this.contractId = data.contractId

        Object.defineProperty(this, "station", {
            get: function() {
                return cache.stations.has(stationId) ?
                    cache.stations.get(stationId) :
                    new Station(stationId)
            }
        })
        Object.defineProperty(this, "contract", {
            get: function() {
                return cache.contracts.has(contractId) ?
                    cache.contracts.get(contractId) :
                    new Contract(contractId)
            }
        })
        cache.advertisements.set(this.name, this)
    }

    deleteThis = () => db.prepare('DELETE FROM advertisement WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM advertisement WHERE id=?').run(name)
    updateThis = () =>
        db.prepare('UPDATE advertisement SET content=?, station_id=?, contract_id=? WHERE id=?')
          .run(this.content, this.stationId, this.contractId, this.name)
    static create = (name, content, stationId, contractId) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO advertisement(id,content,station_id,contract_id) VALUES(?, ?, ?, ?)')
              .run(name, content, stationId, contractId)
    static checkExist = name => db.prepare('SELECT * FROM advertisement WHERE id=?').get(name) != undefined

    getPeopleSeeing = () => return this.station.getPassengersNum()
    getAdvertiser = () => return this.contract.advertiser
}
