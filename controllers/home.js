'use strict';

const logger = require('../logger.js');

var Datasource = require('../modules/datasource.js');

/**
 * GET /
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

const datasource = new Datasource();
datasource.init();
