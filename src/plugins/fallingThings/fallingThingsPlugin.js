(function (FunnyRain) {
  "use strict";

  function FallingThingsPlugin (game) {
    FunnyRain.Plugins.BasePlugin.call(this, "FallingThings", game);

    var _FallManager = null;

    init(this);

    function init (t) {
      _FallManager = new FunnyRain.Plugins.FallingThings.FallManager(t.getGame());
    }

    FallingThingsPlugin.prototype.load = function () {
      _FallManager.load();
    };

    FallingThingsPlugin.prototype.getFallManager = function () {
      return _FallManager;
    };

    FallingThingsPlugin.prototype.enable = function (isEnabled) {
      _FallManager.enable(isEnabled);
    };

    FallingThingsPlugin.prototype.step = function () {
      _FallManager.step();
    };
  }

  FunnyRain.Plugins.FallingThings.FallingThingsPlugin =
    Boplex.inherit(FallingThingsPlugin, FunnyRain.Plugins.BasePlugin);

})(FunnyRain);
