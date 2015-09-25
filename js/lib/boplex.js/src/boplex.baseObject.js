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
