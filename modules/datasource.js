'use strict';

const logger = require('../logger.js');

var mongoose = require('mongoose');

module.exports = class {
	constructor() {
		this.dbUrl = process.env.MONGODB || 'localhost';
	}

  init() {
  	// Read connection info from .env and open connection
  	mongoose.connect(this.dbUrl);

		mongoose.connection.once('open', function () {
		  logger.info("Mongoose connection is now opened");
		});

		// CONNECTION EVENTS
		// When successfully connected
		mongoose.connection.on('connected', function () {  
		  logger.info(`Mongoose connection connected to ${this.dbUrl}!`);
		}.bind(this));

		// If the connection throws an error
		mongoose.connection.on('error',function (err) {  
		  logger.error('Mongoose connection error: ' + err);
		  process.exit(1);
		});

		// When the connection is disconnected
		mongoose.connection.on('disconnected', function () {  
		  logger.info('Mongoose connection disconnected!'); 
		});
  }

  get(type, time) {
  	logger.verbose('Getting data for', type, time);
  }

  put(type, time) {
  	logger.verbose('Putting data for', type, time);
  }
};
