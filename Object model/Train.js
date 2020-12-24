'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

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
                const ids = db.prepare('SELECT id FROM passangers WHERE train_id=?').all(this.name)
                const res = []
                ids.forEach(v => res.push(cache.passengers.has(v.id) ?
                                            cache.passengers.get(v.id) :
                                            new Passenger(v.id))
                return res
            }
        })
        Object.defineProperty(this, "line", {
            get: function() {
                return cache.lines.has(lineId) ? cache.lines.get(lineId) : new Line(lineId)
            }
        })
        Object.defineProperty(this, "worker", {
            get: function() {
                 return cache.workers.has(workerId) ? cache.workers.get(workerId) : new Worker(workerId)
            }
        })
        cache.trains.set(this.name, this)
    }
    deleteThis = () => db.prepare('DELETE FROM train WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM train WHERE id=?').run(name)
    updateThis = () =>
       db.prepare('UPDATE train SET max_capacity=?, station_id=?, worker_id=?, line_id=? WHERE id=?')
         .run(this.maxCapacity, this.stationId, this.workerId, this.lineId, this.name)
    static create = (name, maxCapacity, stationId, workerId, lineId) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO train(id, max_capacity, station_id, worker_id, line_id) VALUES(?, ?, ?, ?, ?)')
              .run(name, maxCapacity, stationId, workerId, lineId)
    static checkExist = name => db.prepare('SELECT * FROM train WHERE id=?').get(name) != undefined


    isOnStation = () => this.stationId > -1
    getStation = () => isOnStation() ? new Station(stationId) : null
}