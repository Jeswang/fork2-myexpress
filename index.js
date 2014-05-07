
var express = function (){
  var app = function (req, res) {
    console.log('Requesting +' + req.url);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end("Error");
  };
  app.listen = function(port, done){
    var http = require("http");
    var server = http.createServer(this);
    server.listen(port, function(){
      done();
    }); 
    return server;
  }
  return app;
}

module.exports = express;

