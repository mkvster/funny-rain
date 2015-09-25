"use strict";
var Boplex = {};

(function(Boplex){

  var _version = "0.0.2";

  function getFuncName(f){
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec(f);
    return (results && results.length > 1) ? results[1] : "";
  }

  function getClassName(obj){
    return getFuncName(obj.constructor);
  }

  function include(x, child){
    var name = getFuncName(child);
    x[name] = child;
  }

  function inherit(x, child,parent){
    include(x, child);
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
  }

  function getLogTime(currentdate){
    currentdate = currentdate || (new Date());
    var datetime = currentdate.getFullYear() +
      "." + (currentdate.getMonth()+1)  +
      "." + currentdate.getDate() +
      "_" + currentdate.getHours() +
      ":" + currentdate.getMinutes() +
      ":" + currentdate.getSeconds();
    return datetime;
  }

  function defineConstProp(x, propName, propVal){
    Object.defineProperty(x, propName, {
      writable: false,
      value: propVal,
    });
  }

  function publish(x){
    x.getFuncName = getFuncName;
    x.getClassName = getClassName;
    x.defineConstProp = defineConstProp;
    x.include = include;
    x.inherit = inherit;
    x.getLogTime = getLogTime;
  }

  defineConstProp(Boplex, "Version", _version);
  publish(Boplex);

})(Boplex);
