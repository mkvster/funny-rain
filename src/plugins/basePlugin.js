(function (FunnyRain) {
  "use strict";

  function BasePlugin (id, game) {
    this._id = id;
    var _game = game;

    function getId (t) {
      return t._id;
    }

    function getGame () {
      return _game;
    }

    BasePlugin.prototype.getPluginId = function () {
      return getId.call(this, this);
    };

    BasePlugin.prototype.getGame = function () {
      return getGame.call(this);
    };
  }

  FunnyRain.Plugins.BasePlugin = BasePlugin;

})(FunnyRain);
