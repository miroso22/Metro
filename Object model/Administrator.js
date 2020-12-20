'use strict'

const db = require('./connector.js').db
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
                return new Metro(metroSystemId)
            }
        })
    }

    getAllComplaints = () => {
        const res = db.prepare('SELECT id FROM complaint').all(this.name)
        res.forEach((v, i, arr) => arr[i] = new Complaint(arr[i].id))
        return res
    }
    getUnansweredComplaints = () => {
        const res = db.prepare('SELECT id FROM complaint WHERE was_answered = 0').all()
        res.forEach((v, i, arr) => arr[i] = new Complaint(arr[i].id))
        return res
    }
    getAllContracts = () => {
        const res = db.prepare('SELECT * FROM advertising_contract').all()
        res.forEach((v, i, arr) => arr[i] = new Contract(arr[i].id))
        return res
    }
}