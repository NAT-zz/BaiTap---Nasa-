const { getAllPlanets } = require('../../models/planets.model')

const httpgetAllPlanets = async(req, res) => {
    return res.status(200).json(await getAllPlanets());
}

module.exports =  {
    httpgetAllPlanets
}
