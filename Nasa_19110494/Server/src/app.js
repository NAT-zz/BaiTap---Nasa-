const express = require('express');
const cors = require('cors');
const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');
const path = require('path');
const app = express();
const morgan = require('morgan');
const request = require('supertest');

app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/planets',planetsRouter);
app.use('/launches',launchesRouter)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

// TEST CASES FOR ALL APIs/ENDPOINTs

// GET '/'
request(app)
    .get('/')
    .expect('Content-Type', /html/)
    .expect('Content-Length', '1002')
    .expect(200)
    .end(function(err, res) {
        if (err) 
            console.log(err);
    });

// GET '/launches'
request(app)
    .get('/launches')
    .expect('Content-Type', /json/)
    // .expect('Content-Length', '396')
    .expect(200)
    .then(response => {
        // check mission name
        if(response.body[0].mission == 'Kepler exploration X')
            console.log('Mission is correct');
    })
    .catch(error => {
        console.log(`error in GET '/launches`, error);
    })

// POST '/launches' : launch added
request(app)
    .post('/launches')
    .send({mission: "testing"})
    .send({rocket: "testing rocket"})
    .send({target: "neptune"})
    .send({launchDate: "January 1, 2023"})
    .expect('Content-Type', /json/)
    .expect('Content-Length', '194')
    .expect(201)
    .then(res => {
        console.log('New launch added: ', res.body);
    })
    .catch(error => {
        console.log(error);
    })

// POST '/launches' : missing required launch property || invalid launch date
request(app)
    .post('/launches')
    .send({mission: "testing"})
    // .send({rocket: "testing rocket"})
    .send({target: "neptune"})
    .send({launchDate: "January 1, 2023"})
    .expect('Content-Type', /json/)
    // .expect('Content-Length', '194')
    .expect(400)
    .then(res => {
        console.log('Response missing property: ',res.body);
    })
    .catch(error => {
        console.log(error);
    })

// DELETE '/launches/100'
request(app)
    .delete('/launches/100')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
        if (err) 
            console.log(err);
        console.log('Flight deleted: ', res.body);
    });

// DELETE '/launches/101' flight not found 
request(app)
    .delete('/launches/102')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '29')
    .expect(404)
    .end((err, res) => {
        if (err)  console.log(err);
        console.log(res.body);
    })

// GET '/planets'
request(app)
    .get('/planets')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '2')
    .expect(200)
    .end(function(err, res) {
        if (err) 
            console.log(err);
        console.log('All planets: ', res.body);
    });

// GET '/upcoming'
request(app)
    .get('/upcoming')
    .expect('Content-Type', /html/)
    .expect('Content-Length', '1002')
    .end((err, res) => {
        if (err) console.log(err);
    })
// GET '/history'
request(app)
    .get('/history')
    .expect('Content-Type', /html/)
    .expect('Content-Length', '1002')
    .end((err, res) => {
        if (err) console.log(err);
    })

module.exports = app;
