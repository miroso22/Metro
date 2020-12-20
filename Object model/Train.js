'use strict'

const db = require('./connector.js').db
const Worker = require('./Worker.js').Worker
const Station = require('./Station.js').Station
const Passenger = require('./Passenger.js').Passenger
const Line = require('./Line.js').Line

class Train
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM train WHERE id=?').get(name)

        this.maxCapacity = data.maxCapacity
        this.stationId = data.stationId
        this.workerId = data.worker_id
        this.lineId = data.line_id

        Object.defineProperty(this, "passengers", {
            get: function() {
                const res = db.prepare('SELECT id FROM passangers WHERE train_id=?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Passenger(arr[i].id))
                return res
            }
        })
        Object.defineProperty(this, "line", {
            get: function() {
                return new Line(lineId)
            }
        })
        Object.defineProperty(this, "worker", {
            get: function() {
                 return new Worker(workerId)
            }
        })
    }

    isOnStation = () => this.stationId > -1
    getStation = () => isOnStation() ? new Station(stationId) : null
}