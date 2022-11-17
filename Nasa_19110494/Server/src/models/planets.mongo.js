const mongo = require('mongoose');

const planetSchema = new mongo.Schema({
    keplerName: {
        type: String,
        required: true,
    }
})

module.exports = mongo.model('Planet', planetSchema);