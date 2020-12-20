'use strict'

const db = require('./connector.js').db
const Line = require('./Line.js').Line
const Administrator = require('./Administrator.js').Administrator

class Metro
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM metro_system WHERE id=?').get(name)

        this.location = data.city_name
        this.monthBudget = data.monthly_budget

        Object.defineProperty(this, "lines", {
            get: function() {
                const res = db.prepare('SELECT id FROM metro_line WHERE metroId = ?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Line(arr[i].id))
                return res
            }
        })
        Object.defineProperty(this, "administrators", {
            get: function() {
                const res = db.prepare('SELECT id FROM administrator WHERE metroId = ?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Administrator(arr[i].id))
                return res
            }
        })
    }
}