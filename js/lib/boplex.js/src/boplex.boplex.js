"use strict";
var Boplex = {};

(function(Boplex){

  var _version = "0.0.3";

  function getFuncName(f){
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec(f);
    return (results && results.length > 1) ? results[1] : "";
  }

  function include(x, child, className){
    x[className] = child;
  }

  function inherit(child, parent){
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
    return child;
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

  function random(a, b){
    return a + Math.round(Math.random()*(b - a));
  }

  function publish(x){
    x.getFuncName = getFuncName;
    x.defineConstProp = defineConstProp;
    x.include = include;
    x.inherit = inherit;
    x.getLogTime = getLogTime;
    x.random = random;
  }

  defineConstProp(Boplex, "Version", _version);
  publish(Boplex);

})(Boplex);
