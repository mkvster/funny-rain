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
