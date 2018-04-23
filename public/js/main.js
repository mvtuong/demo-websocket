$(function() {
	$('#example').DataTable();

  // WebSocket
  var ws = new WebSocket('ws://localhost:3000');
  // event emmited when connected
  ws.onopen = function () {
    console.log('websocket is connected ...');
    // sending a send event to websocket server
    ws.send('Hello from client!');
  }
  // event emmited when receiving message 
  ws.onmessage = function (ev) {
    // console.log('Socket data: ', ev.data);

    if (!isNaN(ev.data)) {
      $('#test-Socket').text(ev.data);
    }
  }
  // Handle any error that occurs.
  ws.onerror = function(error) {
    console.error('WebSocket Error: ' + error);
  };

  // Close if the connection is open.
  if (0 && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
});
