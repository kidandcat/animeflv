var express = require('express');
var router = express.Router();
var path = require('path');
var http = require('http');

var animes = 'nothing yet';
var stars = 'nothing yet';
var users = [];

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

router.get('/favorites/:id', function (req, res, next) {
    var hash = req.params.id;
    if(users[hash]){
        res.send(JSON.stringify(users[hash]));
    }else{
        users[hash] = {
            favorites: []
        };
        res.send('nothing');
    }
    console.log(users);
});

router.get('/favorite/:id/:anime', function (req, res, next) {
    var hash = req.params.id;
    var anime = req.params.anime;
    if(users[hash]){
        users[hash].favorites.push(anime);
    }else{
        users[hash] = {
            favorites: []
        };
        users[hash].favorites.push(anime);
    }
    console.log(users);
    res.send('ok');
});


setInterval(function(){crawl()}, 120000);
crawl();


function crawl() {
    http.get({ host: 'localhost', port: 88 }, function (response) {
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            try{
                animes = JSON.parse(body);
            }catch(e){
                console.log(body);
                animes = body;
            }
        });
    });
    http.get({ host: 'localhost', port: 89 }, function (response) {
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
