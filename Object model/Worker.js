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
    deleteThis = () => db.prepare('DELETE FROM worker WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM worker WHERE id=?').run(name)
    updateThis = () =>
        db.prepare('UPDATE worker SET salary=?, station_id=?, train_id=? WHERE id=?')
          .run(this.expectedTime, this.salary, this.stationId, this.trainId)
    static create = (name, salary, stationId, trainId) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO worker(id, salary, station_id, train_id) VALUES(?, ?)')
              .run(name, salary, stationId, trainId)
    static checkExist = name => db.prepare('SELECT * FROM worker WHERE id=?').get(name) != undefined
}