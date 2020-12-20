'use strict'

const db = require('./connector.js').db
const Station = require('./Station.js').Station
const Metro = require('./Metro.js').Metro
const Train = require('./Train.js').Train

class Line
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM metro_line WHERE id=?').get(name)
        this.metroId = data.metro_id

        Object.defineProperty(this, "stations", {
            get: function() {
                const res = db.prepare('SELECT id FROM metro_station WHERE line_id=?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Station(arr[i].id))
                return res
            }
        })
        Object.defineProperty(this, "trains", {
            get: function() {
                const res = db.prepare('SELECT id FROM train WHERE line_id=?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Train(arr[i].id))
                return res
            }
        })
    }

    getTrainsAmount = () => this.trains.length
    getStationsAmount = () => this.stations.length
}