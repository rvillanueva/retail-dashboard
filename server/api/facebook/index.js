'use strict';

var express = require('express');
var graph = require('fbgraph');
var User = require('../user/user.model');
var auth = require('../../auth/auth.service');

var router = express.Router();


// Routes

router.get('/events', function(req, res) {
  graph.setAccessToken(req.query.token);
  var searchOptions = {
    q:     req.query.q,
    type:  "event",
    limit: 50
  };

  graph.search(searchOptions, function(err, response) {
    return res.send(response)
  });
})

module.exports = router;
