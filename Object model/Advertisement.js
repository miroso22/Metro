'use strict'

const sqlite = require('better-sqlite3')
let db = new sqlite('../sql/metro.db')

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
                return new Station(stationId)
            }
        })
        Object.defineProperty(this, "contract", {
            get: function() {
                return new Contract(contractId)
            }
        })
    }

    getPeopleSeeing = () => return this.station.getPassengersNum()
    getAdvertiser = () => return this.contract.advertiser
}
