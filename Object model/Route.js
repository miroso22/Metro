'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache
const Station = require('./Station.js').Station

class Route
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM metro_route WHERE id=?').get(name)

        this.expectedTime = data.expected_time

        Object.defineProperty(this, "stations", {
            get: function() {
                const ids = db.prepare('SELECT id FROM metro_station WHERE routeId = ?').all(this.name)
                const res = []
                ids.forEach(v => res.push(cache.stations.has(v.id) ? cache.stations.get(v.id) : new Station(v.id)))
                return res
            }
        })
        cache.routes.set(this.name, this)
    }
    deleteThis = () => db.prepare('DELETE FROM metro_route WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM metro_route WHERE id=?').run(name)
    updateThis = () =>
        db.prepare('UPDATE metro_route SET expected_time=? WHERE id=?')
          .run(this.expectedTime, this.name)
    static create = (name, expectedTime) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO metro_route(id, expected_time) VALUES(?, ?)')
              .run(name, expectedTime)
    static checkExist = name => db.prepare('SELECT * FROM metro_route WHERE id=?').get(name) != undefined
}