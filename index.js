
Layer = require('./lib/layer');

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
      var layer = stack[index];
      index++;
      if(!layer||res.headersSent){
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
        var currentFunction = layer.handle;
        var url = req.url;
        if(error){
          if(isErrorHandler(currentFunction) && undefined != layer.match(url)){
            //console.log("Run error function" + currentFunction.toString());
            currentFunction(error, req, res, next);
          }
          else
            next(error);
        }
        else{
          if(!isErrorHandler(currentFunction) && undefined != layer.match(url))
            //console.log("Run normal function" + currentFunction.toString());
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
  app.use = function(fn, fn2){
    //Add Child handle
    if ('function' == typeof fn.handle) {
      var server = fn;
      fn = function(req, res, next){
        server.handle(req, res, next);
      };
    }
    else if ('function' == typeof fn2){
      var layer = new Layer(fn, fn2);
      fn = layer;
    }
    else{
      var layer = new Layer('/', fn);
      fn = layer;
    }

    stack.push(fn);

    return this;
  }
  app.stack = stack;
  return app;
}

module.exports = express;

