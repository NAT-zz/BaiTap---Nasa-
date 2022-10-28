const express = require('express');
const planetsRouter = express.Router();
const {
    httpgetAllPlanets
} = require('./planets.controller');

planetsRouter.get('/', httpgetAllPlanets);

module.exports = planetsRouter;