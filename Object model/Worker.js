'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

const Station = require('./Station.js').Station
const Train = require('./Train.js').Train

class Worker
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM worker WHERE id=?').get(name)

        this.salary = data.salary
        this.stationId = data.station_id
        this.trainId = data.train_id

        Object.defineProperty(this, "station", {
            get: function() {
                return (stationId == -1) ? null :
                    cache.stations.has(stationId) ?
                    cache.stations.get(stationId) :
                    new Station(stationId)
            }
        })
        Object.defineProperty(this, "line", {
            get: function() {
                return (lineId == -1) ? null :
                    cache.lines.has(lineId) ?
                    cache.lines.get(lineId) :
                    new Line(lineId)
            }
        })
        cache.workers.set(this.name, this)
    }
}