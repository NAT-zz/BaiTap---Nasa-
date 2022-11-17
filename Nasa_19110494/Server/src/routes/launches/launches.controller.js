const  { getAllLaunches,
    addNewLaunch,
    existsLanchWithId,
    abortLaunchById
} = require('../../models/launches.model');

const httpgetAllLauches = async (req, res) => {
    return res.status(200).json(await getAllLaunches());
}

const httpAddNewLaunch = async(req, res) => {
    const launch = req.body;
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target)
    {
        return res.status(400).json({
            error: 'Missing required launch property ',
        })
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    }

    await addNewLaunch(launch); 
    return res.status(201).json(launch);
}

const httpAbortLaunch = async(req, res) => {
    const launchId = Number(req.params.id);
    
    if(!await existsLanchWithId(launchId))
    {
        return res.status(404).json({
            error: 'Launch not found,'
        })
    }
    const aborted = await abortLaunchById(launchId);
    return res.status(200).json(aborted)
}

module.exports = { 
    httpgetAllLauches,
    httpAddNewLaunch,
    httpAbortLaunch
};