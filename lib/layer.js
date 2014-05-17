
var p2re = require("path-to-regexp");

Layer = function(path, handle){
  this.handle = handle;
  var reg=new RegExp("/$","g");
  this.path = path.replace(reg, "");
  var names = [];
  this.re = p2re(this.path, names, {end: false});
  this.names = names;
}

Layer.prototype.match = function(string){
  var matched = this.re.test(string);
  if( false == matched){
    return undefined;
  }
  else{
    var m = this.re.exec(string);
    var result = {};
    result['path'] = m[0];
    var params = {};
    for(var i in this.names){
      var index = parseInt(i)+1;
      params[this.names[i].name] = decodeURIComponent(m[index]);
    }
    result['params'] = params;
    return result;
  }
}

module.exports = Layer;
