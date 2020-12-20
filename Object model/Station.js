'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

const Worker = require('./Worker.js').Worker
const Advertisement = require('./Advertisement').Advertisement
const Train = require('./Train.js').Train
const Passenger = require('./Passenger.js').Passenger
const Line = require('./Line.js').Line

class Station
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM metro_station WHERE id=?').get(name)

        this.monthIncome = data.monthIncome
        this.hasTrain = this.getTrainsNum() > 0
        this.maxPassengerCapacity = data.maxPassengerCapacity
        this.lineId = data.line_id
        this.routeId = data.route_id

        Object.defineProperty(this, "workers", {
            get: function() {
                const ids = db.prepare('SELECT id FROM worker WHERE station_id=?').all(this.name)
                const res = []
                ids.forEach(v =>
                    res.push(cache.workers.has(v.id) ? cache.workers.get(v.id) : new Worker(v.id))
                return res
            }
        })
        Object.defineProperty(this, "passengers", {
            get: function() {
                const ids = db.prepare('SELECT id FROM passangers WHERE station_id=?').all(this.name)
                const res = []
                ids.forEach(v =>
                    res.push(cache.passengers.has(v.id) ? cache.passengers.get(v.id) new Passenger(v.id))
                return res
            }
        })
        Object.defineProperty(this, "advertisements", {
            get: function() {
                const ids = db.prepare('SELECT id FROM advertisement WHERE station_id=?').all(this.name)
                const res = []
                ids.forEach(v =>
                    res.push(cache.advertisements.has(v.id) ? cache.advertisements.get(v.id) : new Advertisement(v.id))
                return res
            }
        })
        Object.defineProperty(this, "train", {
            get: function() {
                const res = db.prepare('SELECT id FROM train WHERE station_id=?').get(this.name)
                return cache.trains.has(trainId) ? cache.trains.get(trainId) : new Train(res.id)
            }
        })
        Object.defineProperty(this, "line", {
            get: function() {
                return cache.lines.has(lineId) ? cache.lines.get(lineId) : new Line(lineId)
            }
        })

        cache.stations.set(this.name, this)
    }

    getWorkersNum = () => db.prepare('SELECT COUNT(*) FROM worker WHERE station_id=?').get(this.name)
    getPassengersNum = () => db.prepare('SELECT COUNT(*) FROM passangers WHERE station_id=?').get(this.name)
    getAdvertisementsNum = () => db.prepare('SELECT COUNT(*) FROM advertisement WHERE station_id=?').get(this.name)
    getTrainsNum = () => db.prepare('SELECT COUNT(*) FROM train WHERE station_id=?').get(this.name)
}

const station = new Station(1)