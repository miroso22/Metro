'use strict'

const db = require('./connector.js').db
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
                const res = db.prepare('SELECT id FROM metro_station WHERE routeId = ?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Station(arr[i].id))
                return res
            }
        })
    }
}