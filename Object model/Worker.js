'use strict'

const db = require('./connector.js').db
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
                return (station_id == -1) ? null : new Station(stationId)
            }
        })
        Object.defineProperty(this, "line", {
            get: function() {
                return (lineId == -1) ? null : new Line(lineId)
            }
        })
    }
}