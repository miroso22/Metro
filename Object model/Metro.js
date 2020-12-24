'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

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
                const ids = db.prepare('SELECT id FROM metro_line WHERE metroId = ?').all(this.name)
                const res = []
                ids.forEach(v => res.push(cache.lines.has(v.id) ? cache.lines.get(v.id) : new Line(v.id)))
                return res
            }
        })
        Object.defineProperty(this, "administrators", {
            get: function() {
                const ids = db.prepare('SELECT id FROM administrator WHERE metroId = ?').all(this.name)
                const res = []
                ids.forEach(v => res.push(cache.administrators.has(v.id) ?
                                            cache.administrators.get(v.id) :
                                            new Administrator(v.id)))
                return res
            }
        })
        cache.metroSystems.set(this.name, this)
    }

    deleteThis = () => db.prepare('DELETE FROM metro_system WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM metro_system WHERE id=?').run(name)
    updateThis = () =>
        db.prepare('UPDATE metro_system SET location=?, month_budget=? WHERE id=?')
          .run(this.location, this.monthBudget, this.name)
    static create = (name, location, monthBudget) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO metro_system(id, location, month_budget) VALUES(?, ?, ?)')
              .run(name, location, monthBudget)
    static checkExist = name => db.prepare('SELECT * FROM metro_system WHERE id=?').get(name) != undefined
}