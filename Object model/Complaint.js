'use strict'

const db = require('./connector.js').db
const cache = require('./cache.js').cache
class Complaint
{
    constructor(name)
    {
        this.name = name
        let data = db.prepare('SELECT * FROM complaint WHERE id=?').get(name)

        this.sendDate = data.send_date
        this.content = data.content
        this.wasAnswered = data.was_answered
        this.senderId = data.send_by_id

        Object.defineProperty(this, "sender", {
            get: function() {
                return cache.passengers.has(senderId) ?
                            cache.passengers.get(senderId) :
                            new Passenger(senderId)
            }
        })

        cache.complaints.set(this.name, this)
    }

    deleteThis = () => db.prepare('DELETE FROM complaint WHERE id=?').run(this.name)
    static delete = (name) => db.prepare('DELETE FROM complaint WHERE id=?').run(name)
    updateThis = () =>
        db.prepare('UPDATE complaint SET send_date=?, content=?, was_answered=?, senderId=? WHERE id=?')
          .run(this.sendDate, this.content, this.wasAnswered, this.senderId, this.name)
    static create = (name, sendDate, content, wasAnswered, senderId) =>
        if (checkExist(name))
            throw new Error('Already exists!')
        else
            db.prepare('INSERT INTO complaint(id, send_date, content, was_answered, sender_id) VALUES(?, ?, ?, ?, ?)')
              .run(name, sendDate, content, wasAnswered, senderId)
    static checkExist = name => db.prepare('SELECT * FROM complaint WHERE id=?').get(name) != undefined
}