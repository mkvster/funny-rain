(function (FunnyRain) {
  "use strict";

  function ScoreBoardPlugin (game) {
    FunnyRain.Plugins.BasePlugin.call(this, "ScoreBoard", game);

    var _ScoreManager = null;

    init(this);

    function init (t) {
      _ScoreManager = new FunnyRain.Plugins.ScoreBoard.ScoreManager(t.getGame());
    }

    ScoreBoardPlugin.prototype.load = function () {
      _ScoreManager.load();
    };

    ScoreBoardPlugin.prototype.getScoreManager = function () {
      return _ScoreManager;
    };

    ScoreBoardPlugin.prototype.enable = function (isEnabled) {
      return _ScoreManager.enable(isEnabled);
    };
  }


  FunnyRain.Plugins.ScoreBoard.ScoreBoardPlugin =
    Boplex.inherit(ScoreBoardPlugin, FunnyRain.Plugins.BasePlugin);

})(FunnyRain);
