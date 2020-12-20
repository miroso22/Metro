'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache
const Station = require('./Station.js').Station

class Metro
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM metro_route WHERE id=?').get(name)

        this.expectedTime = data.expected_time
        this.monthBudget = data.monthly_budget

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
}