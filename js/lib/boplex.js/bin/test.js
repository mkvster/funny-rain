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

(function(target){
  "use strict";

  function BaseObject() {
    "obsolete";
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
var boplexTest = {};
(function(boplexTest){

  boplexTest.Version = "0.0.3";

})(boplexTest);

(function(boplexTest){
  "use strict";

  function Point(name, x, y, onMoved) {
    Boplex.BaseObject.call(this);
    var _logger = new Boplex.Logger("boplexTest.Point");
    this.name = name;
    var _x = x;
    var _y = y;
    var _onMoved = onMoved;

    function _getName(t){
      return t.name;
    }

    Point.prototype.getName = function(){
      return _getName.call(this, this);
    };

    Point.prototype.getPosition = function(){
      return {x: _x, y: _y};
    };

    Point.prototype.setPosition = function(pos){
      _logger.log("x:" + _x + ", y: " + _y);
      _x = pos.x;
      _y = pos.y;
      (new Boplex.Event(this, _onMoved)).raise(pos);
      _logger.log("x:" + _x + ", y: " + _y);
    };
  }
  boplexTest.Point = Boplex.inherit(Point, Object);

})(boplexTest);

console.log("Boplex Version: " + Boplex.Version);

boplexTest.Point.prototype.className = "boplexTest.Point";
var pt = new boplexTest.Point("A", 3, Boplex.random(0, 5), function(pt, pos){
  console.log("Point \"" + pt.getName() + "\" has been moved to:");
  console.dir(pos);
});

console.log(pt.className);
console.log("Point \"" + pt.getName() + "\" is located at:");
console.dir(pt.getPosition());
pt.setPosition({x: 4, y: 5});

console.log(boplexTest.Point.prototype);
console.dir(boplexTest.Point.prototype);
