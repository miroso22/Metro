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
    getPeopleSeeing = () => return this.station.getPassengersNum()
    getAdvertiser = () => return this.contract.advertiser
}
