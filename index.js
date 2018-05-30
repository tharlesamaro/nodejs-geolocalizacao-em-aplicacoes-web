var restify = require('restify');

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBzt3sAHIz6d6Md5xexeYDfYyXJ0b3vNwQ',
    Promise: Promise
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'tharles',
        password: '12345678',
        database: 'nodejs_geo'
    }
});

const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get("/all", function (req, res, next) {
    knex('places').then((dados) => {
        res.send(dados);
    }, next)
    return next();
});

server.get("/geocode", function (req, res, next) {
    // Geocode an address with a promise
    googleMapsClient.geocode({
            address: '1600 Amphitheatre Parkway, Mountain View, CA'
        }).asPromise()
        .then((response) => {
            const address = response.json.results[0].formatted_address;
            const place_id = response.json.results[0].place_id;
            res.send({
                place_id,
                address
            });
        })
        .catch((err) => {
            res.send(err);
        });
});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});