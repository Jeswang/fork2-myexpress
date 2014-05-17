
Layer = function(path, handle){
  this.handle = handle;
  this.path = path;

}

Layer.prototype.match = function(string){
  result = string.match(this.path);
  if( undefined == result ){
    return undefined;
  }
  else{
    return { path: result[0]}
  }
}

module.exports = Layer;
