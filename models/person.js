const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema(
    {
        "name": {
            type: String,
            required: true
        },
        "nationality":{
            type: String,
            required: true
        },
        "birthdate":{
            type: String,
            required: true
        },
        "timezone":{
            type: String,
            required: true
        }
    }, {timestamps: true}
);


const PersonData = mongoose.model('person', personSchema);
module.exports = PersonData;