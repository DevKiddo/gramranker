'use strict'

let express = require('express');
let rh = require('../api/requestHandlers');
let router = express.Router();

var ranker = function(number) {
    if (number <= 10) {
        return 'top 10';
    } else if (number <= 30) {
        return 'top 30';
    } else if (number <= 50) {
        return 'top 50';
    } else if (number <= 100) {
        return 'top 100';
    } else if (number <= 200) {
        return 'top 200';
    } else if (number <= 300) {
        return 'top 300';
    } else if (number <= 400) {
        return 'top 400';
    } else if (number <= 500) {
        return 'top 500';
    } else if (number <= 600) {
        return 'top 600';
    } else if (number <= 700) {
        return 'top 700';
    } else if (number <= 800) {
        return 'top 800';
    } else if (number <= 900) {
        return 'top 900';
    } else if (number <= 1000) {
        return 'top 1000';
    }
}

router.get('/data', function(req, res) {
    fs.readFile('./data/top-media-array-12grams', 'utf-8', function(err, file) {
        if (err) {
            res.send('something went wrong.');
            return;
        }
        res.send(JSON.stringify(eval(JSON.parse(file)).slice(0, 12)));
    });
});

router.post('/top1000', function(req, res) {

    fs.readFile('./data/top-media-array-1000grams', 'utf-8', function(err, file) {
        if (err) {
            res.send('something went wrong.');
            return;
        }
        var top1000 = eval(JSON.parse(file)).slice(0, 1000);
        var ranking = [];
        for (var i = 0; i < top1000.length; i++) {
            if (top1000[i].user === req.body.username) {
                ranking.push({
                    user: top1000[i].user,
                    ranking: ranker(i + 1),
                    link: top1000[i].link
                })
            }
        }
        console.log('Request for ' + req.body.username + ' was received.');
        res.end(JSON.stringify(ranking))
    });

});

module.exports = router;