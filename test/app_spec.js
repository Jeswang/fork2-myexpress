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
});
