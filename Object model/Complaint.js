'use strict'

const db = require('./connector.js').db
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
                return new Passenger(senderId)
            }
        })
    }
}