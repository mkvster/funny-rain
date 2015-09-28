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
