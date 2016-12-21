'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: "mcdonalds-secret",

  FACEBOOK_ID: '1569712479983259',
  FACEBOOK_SECRET: '7593b9c5108f8b12ae346bac74247500',

  TWITTER_ID: 'app-id',
  TWITTER_SECRET: 'secret',

  GOOGLE_ID: 'app-id',
  GOOGLE_SECRET: 'secret',

  YELP_CONSUMER_KEY:'GcB4SngYwGokoEd4vofytQ',
  YELP_CONSUMER_SECRET:'KJHbaDr-KjZ1FiX6DFqPiE4jNZI',
  YELP_ACCESS_TOKEN_KEY:'YwXLs781Y8DM_4oPPF9AZAarq-S6qKsk',
  YELP_ACCESS_TOKEN_SECRET:'ETL5tvoKDP1af1Qq69aTyQoX1Xw',


  TWITTER_CONSUMER_KEY:'ZOpm6eGSpF1wZz91hzUAEW1Ue',
  TWITTER_CONSUMER_SECRET:'F5Jah8SnULrpcxpo1YwdW4AGtfZ3T316HfjspMsWBuIovRTR1F',
  TWITTER_ACCESS_TOKEN_KEY:'609265402-Wn32qmb738fHQZIn4HcQhBgzbYBraLp5ngGBM3h6',
  TWITTER_ACCESS_TOKEN_SECRET:'YcaGaHmO93iQQ62ZsNByicYOxsgLNI2sZJkcN0kN1iQzQ',

  MONGOLAB_URI: 'mongodb://IbmCloud_2m02kfrh_1vmkd9bt_fjs9u23u:VDJilWAV7zlNH-8yowTtHZe-KkEL7alG@ds055200.mongolab.com:55200/IbmCloud_2m02kfrh_1vmkd9bt',


  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
