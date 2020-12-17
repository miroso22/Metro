'use strict'

const sqlite = require('better-sqlite3')
let db = new sqlite('../sql/metro.db')

const Worker = require('./Worker.js').Worker
const Advertisement = require('./Advertisement').Advertisement
//const Train = require('./Train.js').Train
//const Passenger = require('./Passenger.js').Passenger
//const Line = require('./Line.js').Line

class Station
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM metro_station WHERE id=?').get(name)

        this.monthIncome = data.monthIncome                     //
        this.hasTrain = this.getTrainsNum() > 0                 // Attributes
        this.maxPassengerCapacity = data.maxPassengerCapacity   //
        this.lineId = data.line_id                              //

        Object.defineProperty(this, "workers", {
            get: function() {
                const res = db.prepare('SELECT id FROM worker WHERE station_id=?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Worker(arr[i].id))
                return res
            }
        })
        Object.defineProperty(this, "passengers", {
            get: function() {
                const res = db.prepare('SELECT id FROM passangers WHERE station_id=?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Passenger(arr[i].id))
                return res
            }
        })
        Object.defineProperty(this, "advertisements", {
            get: function() {
                const res = db.prepare('SELECT id FROM advertisement WHERE station_id=?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Advertisement(arr[i].id))
                return res
            }
        })
        Object.defineProperty(this, "train", {
            get: function() {
                const res = db.prepare('SELECT id FROM train WHERE station_id=?').get(this.name)
                return new Train(res.id)
            }
        })
        Object.defineProperty(this, "line", {
            get: function() {
                return new Line(lineId)
            }
        })
    }

    getWorkersNum = () => db.prepare('SELECT COUNT(*) FROM worker WHERE station_id=?').get(this.name)
    getPassengersNum = () => db.prepare('SELECT COUNT(*) FROM passangers WHERE station_id=?').get(this.name)
    getAdvertisementsNum = () => db.prepare('SELECT COUNT(*) FROM advertisement WHERE station_id=?').get(this.name)
    getTrainsNum = () => db.prepare('SELECT COUNT(*) FROM train WHERE station_id=?').get(this.name)
}

const station = new Station(1)