'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

const Complaint = require('./Complaint.js').Complaint
const Contract = require('./Contract.js').Contract
const Metro = require('./Metro.js').Metro

class Administrator
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM administrator WHERE id=?').get(name)

        this.metroSystemId = data.metro_id

        Object.defineProperty(this, "metroSystem", {
            get: function() {
                return cache.metroSystems.has(metroSystemId)?
                    cache.metroSystems.get(metroSystemId) :
                    new Metro(metroSystemId)
            }
        })

        cache.administrators.set(this,name, this)
    }

    deleteThis = () => db.prepare('DELETE FROM administrator WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM administrator WHERE id=?').run(name)
    updateThis = () =>
        db.prepare('UPDATE administrator SET metro_id=? WHERE id=?')
          .run(this.metroSystemId, this.name)
    static create = (name, metroSystemId) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO administrator(id, metro_id) VALUES(?, ?)')
              .run(name, metroSystemId)
    static checkExist = name => db.prepare('SELECT * FROM administrator WHERE id=?').get(name) != undefined

    getAllComplaints = () => {
        const ids = db.prepare('SELECT id FROM complaint').all(this.name)
        const res = []
        ids.forEach(v => res.push(cache.complaints.has(v.id) ?
                        cache.complaints.get(v.id) :
                        new Complaint(arr[i].id)))
        return res
    }
    getUnansweredComplaints = () => {
        const ids = db.prepare('SELECT id FROM complaint WHERE was_answered = 0').all()
        const res = []
        ids.forEach(v => res.push(cache.complaints.has(v.id) ?
                        cache.complaints.get(v.id) :
                        new Complaint(v.id)))
        return res
    }
    getAllContracts = () => {
        const ids = db.prepare('SELECT id FROM advertising_contract').all()
        const res = []
        ids.forEach(v => res.push(cache.contracts.has(v.id) ?
                        cache.contracts.get(v.id) :
                        new Contract(v.id)))
        return res
    }

    cache.administrators.set(this.name, this)
}