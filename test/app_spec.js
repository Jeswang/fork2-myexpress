var express = require("../");
var request = require("supertest");

describe("app",function() {
  // factory function returns an express app
  var app = express();

  describe("create http server",function() {
    it('responds to /foo with 404', function(done){
      request(app)
      .get('/foo')
      .expect(404)
      .end(function(err, res){
        if (err) throw err;
        done();
      });
    })   
  });

  describe("calling middleware stack",function() {
    it('should return m2', function(done){
      var app = express();
      var m1 = function(req,res,next) {
        next();
      };
      var m2 = function(req,res,next) {
        res.end("m2");
      };
      app.use(m1);
      app.use(m2);
      // test cases
      request(app)
      .get('/foo')
      .expect('m2')
      .end(function(err, res){
        if (err) throw err;
        done();
      });
    });
  });
});
