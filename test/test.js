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

(function(target){
  "use strict";

  function BaseObject() {
    BaseObject.prototype.getClassName = function() {
      return Boplex.getClassName(this);
    };
  }

  function publish(x){
    x.BaseObject = BaseObject;
  }

  publish(target);

})(Boplex);

(function(Boplex){
  "use strict";

  function Logger(name){
    var _name = name;

    Logger.prototype.log = function(txt){
      console.log(Boplex.getLogTime() + " " + _name + " " + txt);
    };
  }

  function publish(x){
    x.Logger = Logger;
  }

  publish(Boplex);

})(Boplex);

(function(Boplex){
  "use strict";

  function Event(context, handler){
    var _context = context;
    var _handler = handler;

    Event.prototype.raise = function (args) {
      if (!_handler){
        return;
      }
      _handler(_context, args);
    };
  }

  function publish(x){
    x.Event = Event;
  }

  publish(Boplex);

})(Boplex);

"use strict";
var FunnyRain = {};
(function(FunnyRain){

  Boplex.defineConstProp(FunnyRain, "Version", "0.0.1");

})(FunnyRain);

(function(target){
  "use strict";

  function Game(element){
    Boplex.BaseObject.call(this);
    var _element = element;
    _element;
  }

  Boplex.inherit(target, Game, Boplex.BaseObject);

})(FunnyRain);

console.log("Testing FunnyRain... ");

console.dir(FunnyRain);

console.log("Test completed!");
