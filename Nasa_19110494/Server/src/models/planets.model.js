const { rejects } = require('assert');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./planets.mongo');

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}
const loadPlanetsData = async() => {
    return new Promise((resolve, resject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', '/kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', (data) => {
            if (isHabitablePlanet(data)) {
                savePlanet(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            rejects(err);
        })
        .on('end', async () => {
            const allPlanets = await getAllPlanets();
            console.log(allPlanets);

            console.log(`${allPlanets.length} habitable planets found!`);
            resolve();
        });
    });
}

const getAllPlanets = async () => {
    return await planets.find({}, ('-_id -__v'));
}

const savePlanet = async (planet) => {
    try{
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
    } catch(error)
    {
        console.log(error.message);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
};