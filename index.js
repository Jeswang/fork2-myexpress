
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
  if(result === null)
    result = [];
  return result;
}

function isErrorHandler(func){
  var paraNumber = getParamNames(func).length;
  if(paraNumber == 4){
    return true;
  }
  return false;
}

var express = function (){

  var stack = [];
  var app = function (req, res, next) {
    app.handle(req, res, next);
  }


  app.handle = function(req, res, out){
    index = 0;
    function next(error){
      currentFunction = stack[index];
      index++;
      if(!currentFunction||res.headersSent){
        if (out) {
          console.log("Pass to parent");
          return out(error);
        }
        if (error){
          res.statusCode = 500;
          if(error.status) res.statusCode = error.statusCode;
          if(res.headersSend) return req.socket.destroy;
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Content-Length', Buffer.byteLength(error.toString()));
          console.log(res.statusCode);
          if ('HEAD' == req.method) return res.end();
          res.end(error.toString());
        }
        else{
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end("Error");
        }
        return;
      }
      try{
        if(error){
          if(isErrorHandler(currentFunction)){
            console.log("Run error function" + currentFunction.toString());
            currentFunction(error, req, res, next);
          }
          else
            next(error);
        }
        else{
          console.log("Run normal function" + currentFunction.toString());
          if(!isErrorHandler(currentFunction))
            currentFunction(req, res, next);
          else
            next();
        }
      } catch (e) {
        next(e);
      }
    }
    next();
  };
  app.listen = function(port, done){
    var http = require("http");
    var server = http.createServer(this);
    server.listen(port, function(){
      done();
    }); 
    return server;
  }
  app.use = function(fn){

    if ('function' == typeof fn.handle) {
      var server = fn;
      fn = function(req, res, next){
        server.handle(req, res, next);
      };
    }

    stack.push(fn);

    return this;
  }
  return app;
}

module.exports = express;

