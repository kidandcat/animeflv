var express = require('express');
var router = express.Router();
var path = require('path');
var http = require('http');

var animes = 'nothing yet';
var stars = 'nothing yet';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.join(process.cwd(), 'public', 'html', 'index.html'));
});


router.get('/animes', function (req, res, next) {
    res.send(animes);
});

router.get('/stars', function (req, res, next) {
    res.send(stars);
});

router.get('/:anime/:episode', function (req, res, next) {
    console.log('anime');
    var anime = req.params.anime;
    var episode = req.params.episode;
    res.redirect('http://animeflv.net/ver/' + anime + '-' + episode + '.html');
});



setInterval(function(){crawl()}, 60000);
crawl();


function crawl() {
    http.get({ host: 'localhost', port: 88 }, function (response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            animes = JSON.parse(body);
        });
    });
    http.get({ host: 'localhost', port: 89 }, function (response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            stars = JSON.parse(body);
        });
    });
}


module.exports = router;
