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
