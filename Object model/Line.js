'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

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
                const ids = db.prepare('SELECT id FROM metro_station WHERE line_id=?').all(this.name)
                const res = []
                ids.forEach(v =>
                    res.push(cache.stations.has(v.id) ? cache.stations.get(v.id) : new Station(v.id))
                return res
            }
        })
        Object.defineProperty(this, "trains", {
            get: function() {
                const ids = db.prepare('SELECT id FROM train WHERE line_id=?').all(this.name)
                const res = []
                ids.forEach(v =>
                    res.push(cache.trains.has(v.id) ? cache.trains.get(v.id) : new Train(v.id))
                return res
            }
        })

        cache.lines.set(this.name, this)
    }
    deleteThis = () => db.prepare('DELETE FROM metro_line WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM metro_line WHERE id=?').run(name)
    updateThis = () =>
        db.prepare('UPDATE metro_line SET metro_id=? WHERE id=?')
          .run(this.metroId, this.name)
    static create = (name, metroId) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO metro_line(id, metro_id) VALUES(?, ?)')
              .run(name, metroId)
    static checkExist = name => db.prepare('SELECT * FROM metro_line WHERE id=?').get(name) != undefined

    getTrainsAmount = () => this.trains.length
    getStationsAmount = () => this.stations.length
}