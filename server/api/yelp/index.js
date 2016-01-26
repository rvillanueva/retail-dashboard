'use strict';

var express = require('express');
var router = express.Router();
var yelp = require("yelp").createClient({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_ACCESS_TOKEN_KEY,
  token_secret: process.env.YELP_ACCESS_TOKEN_SECRET
});

router.get('/search', function(req, res){
  yelp.search(req.query, function(error, data) {
    if (error) throw error;
    return res.send(data)
  });
});

router.get('/business', function(req, res){
  yelp.business(req.query.id, function(error, data) {
    if (error) throw error;
    return res.send(data)
  });
});

module.exports = router;
