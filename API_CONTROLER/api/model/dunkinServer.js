var mongoose = require('mongoose');
var dunkinSchema = mongoose.Schema({
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    open:String,
    location:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

dunkinSchema.index({location: '2dsphere'})

module.exports = mongoose.model('Dunkin',dunkinSchema)