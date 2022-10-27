const express = require('express');
const cors = require('cors');
const planetsRouter = require('./routes/planets/planets.router');
const path = require('path');
const app = express();

const getPath = path.join(__dirname, '../public');
app.use(express.static(getPath));
console.log(getPath)
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(express.json());
app.use(planetsRouter);

module.exports = app;