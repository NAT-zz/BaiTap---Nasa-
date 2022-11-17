const mongo = require('mongoose');

mongo.connection.once('open', () => {
    console.log('Mongo connection ready');
});

mongo.connection.on('error', () => {
    console.log('Mongo connection error');
})

const connectMongo = async() => {
    await mongo.connect('mongodb://localhost:27017/nasa');
};

const disconnnectMongo = async() => {
    await mongo.disconnect();
};

module.exports = {
    connectMongo,
    disconnnectMongo
}
