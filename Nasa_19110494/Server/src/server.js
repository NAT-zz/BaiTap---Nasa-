const http = require("http");
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const { connectMongo } = require('./services/mongo');
const { initLaunch } = require('./models/launches.model');

(async function startServer()
{
    await connectMongo();
    await loadPlanetsData();
    await initLaunch();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
})();

