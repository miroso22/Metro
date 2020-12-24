'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache

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
                const ids = db.prepare('SELECT id FROM complaint WHERE send_by_id=?').all(this.name)
                const res = []
                ids.forEach((v => res.push(cache.complaints.has(v.id) ?
                                    cache.complaints.get(v.id) :
                                    new Complaint(v.id)))
                return res
            }
        })
        cache.passengers.set(this.name, this)
    }

    deleteThis = () => db.prepare('DELETE FROM passanger WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM passanger WHERE id=?').run(name)
    updateThis = () =>
        db.prepare('UPDATE passanger SET money=?, station_id=?, train_id=? WHERE id=?')
          .run(this.cash, this.stationId, this.trainId, this.name)
    static create = (name, cash, stationId, trainId) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO passanger(id,money,station_id,train_id) VALUES(?, ?, ?, ?)')
              .run(name, cash, stationId, trainId)
    static checkExist = name => db.prepare('SELECT * FROM passanger WHERE id=?').get(name) != undefined

    isOnStation = () => this.stationId > -1
    isOnTrain = () => this.trainId > -1
    getStation = () => isOnStation() ?
                        cache.stations.has(stationId) ? cache.stations.get(stationId) : new Station(stationId) :
                        null
    getTrain = () => isOnTrain() ?
                        cache.trains.has(trainId) ? cache.trains.get(trainId) : new Train(trainId) :
                        null
    getComplaintsCount = () => this.complaints.length
}