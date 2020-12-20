'use strict'

const db = require('./connector.js').db
const Station = require('./Station.js').Station
const Complaint = require('./Complaint.js').Complaint
const Train = require('./Train.js').Train

class Passenger
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM passanger WHERE id=?').get(name)

        this.cash = data.money
        this.stationId = data.station_id
        this.trainId = data.train_id

        Object.defineProperty(this, "complaints", {
            get: function() {
                const res = db.prepare('SELECT id FROM complaint WHERE send_by_id=?').all(this.name)
                res.forEach((v, i, arr) => arr[i] = new Complaint(arr[i].id))
                return res
            }
        })
    }

    isOnStation = () => this.stationId > -1
    isOnTrain = () => this.trainId > -1
    getStation = () => isOnStation() ? new Station(stationId) : null
    getTrain = () => isOnTrain() ? new Train(trainId) : null
    getCopmlaintsCount = () => this.complaints.length
}