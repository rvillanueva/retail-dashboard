'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'social-secret',

  FACEBOOK_ID: 'facebook-id',
  FACEBOOK_SECRET: 'facebook-secret',

  TWITTER_ID: 'app-id',
  TWITTER_SECRET: 'secret',

  GOOGLE_ID: 'app-id',
  GOOGLE_SECRET: 'secret',

  YELP_CONSUMER_KEY:'',
  YELP_CONSUMER_SECRET:'',
  YELP_ACCESS_TOKEN_KEY:'',
  YELP_ACCESS_TOKEN_SECRET:'',


  TWITTER_CONSUMER_KEY:'',
  TWITTER_CONSUMER_SECRET:'',
  TWITTER_ACCESS_TOKEN_KEY:'',
  TWITTER_ACCESS_TOKEN_SECRET:'',

  MONGOLAB_URI: '',


  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
