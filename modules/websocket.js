'use strict';

const logger = require('../logger.js');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;

module.exports = function(server) {
	// Verify the client
	const verifyClient = (info, cb) => {
		const origin = info.origin;

		// TODO: update this
		if (origin === 'http://localhost:3000') {
			cb(true);
		} else {
			cb(false, 401, 'Unauthorized');
		}
	};

	const wss = new SocketServer({ server, verifyClient });

	// Define broadcast function
	wss.broadcast = function broadcast(data) {
	  wss.clients.forEach(function each(client) {
	    if (client.readyState === WebSocket.OPEN) {
	      client.send(data);
	    }
	  });
	};

	const ack = (error) => {
		// If error is not defined, the send has been completed, otherwise the error
    // object will indicate what failed.
    if (error) {
    	logger.error(error);
    }
	}

	// Init Websocket ws and handle incoming connect requests
	wss.on('connection', function connection(ws) {
	  logger.verbose("Imcoming connection ...");
	  ws.isAlive = true;
		const heartbeat = () => { ws.isAlive = true; }
	  ws.on('pong', heartbeat);

	  //on connect message
	  ws.on('message', function incoming(message) {
      logger.verbose('Message received: ', message);
	  });

	  ws.send('Hello from server :D', ack);
	});

	wss.on('close', function(reasonCode, description) {
	  // The connection is getting closed.
	  logger.verbose('Socket is closed: ', reasonCode, description);
	});

	let i = 0;
	const repeat = setInterval(function() {
		i += 1;
	  wss.broadcast(i);
	}, 300);

	// Empty func.
	const noop = () => {};

	// Detect and close client broken connections
	const interval = setInterval(function ping() {
	  wss.clients.forEach(function each(ws) {
	    if (ws.isAlive === false) {
	    	logger.verbose('Terminate a ws');
	    	return ws.terminate();
	    }

	    ws.isAlive = false;
	    ws.ping(noop);
	  });
	}, 30000);
}