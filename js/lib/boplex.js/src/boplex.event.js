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
