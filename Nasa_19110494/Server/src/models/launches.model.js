const launches = new Map();
const launchModel = require('./launch.mongo');
const planets = require('./planets.mongo');

let latestFlightNumber = 100;

const initLaunch = async() => {
    console.log('Init launches');
    const launch = {
        flightNumber: 1,
        mission: 'Kepler exploration X',
        rocket: 'Explorer IS1',
        launchDate: new Date('December 27, 2030'),
        target: 'Kepler-442 b',
        customers: ['NASA', 'ZTM'],
        upcoming: true,
        success: true,
    };
    await saveLaunch(launch);
}

const existsLanchWithId = async(launchId) => {
    return await launchModel.find({flightNumber: launchId})
}

const getAllLaunches = async() => {
    return await launchModel
        .find({}, ('-_id -__v'))
        .sort({ flightNumber: 1 });
}

const getLastestFlightNumber = async() => {
    const lastestFlight = await launchModel.findOne().sort('-flightNubmer');
    if(!lastestFlight)
        return latestFlightNumber;
    return lastestFlight.flightNumber;
}

const saveLaunch = async(launch) => {
    await launchModel.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

const addNewLaunch = async(launch) => {
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if(!planet){
        throw new Error('No matching planet found');
    }

    const lastestNumber = await getLastestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: lastestNumber,
        customers: ['Zero to mastery', 'NASA'],
        success: true,
        upcoming: true,
    });

    await saveLaunch(newLaunch);
}

const abortLaunchById = async(launchId) => {
    const aborted = await launchModel.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1;
}

module.exports =  {
    existsLanchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
    initLaunch
}