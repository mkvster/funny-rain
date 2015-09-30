(function (FunnyRain) {
  "use strict";

  function ScoreManager (game) {
    var _game = game;
    var _lives;
    var _score;
    var _dialog = null;
    var _isEnabled = false;
    var _view;

    function load () {
      _view = _game.getView();
      _dialog = new FunnyRain.Graphics.Widgets.ScoreBoardDialog();
      _view.createWidget(_dialog.createDialog());
    }

    function enable (isEnabled) {
      if (isEnabled === _isEnabled) {
        return;
      }
      _isEnabled = isEnabled;
      if (_isEnabled) {
        resetScoreBoard();
      }
    }

    function setLives (x) {
      _lives = x;
      _dialog.setLives(x);
    }

    function setScore (x) {
      _score = x;
      _dialog.setScore(x);
    }

    function changeLives (dx) {
      setLives(_lives + dx);
    }

    function changeScore (dx) {
      setScore(_score + dx);
    }

    function resetScoreBoard () {
      setScore(0);
      setLives(3);
    }

    ScoreManager.prototype.load = function () {
      load.call(this);
    };

    ScoreManager.prototype.enable = function (x) {
      enable.call(this, x);
    };

    ScoreManager.prototype.changeScore = function (dx) {
      changeScore.call(this, dx);
    };

    ScoreManager.prototype.changeLives = function (dx) {
      changeLives.call(this, dx);
    };

  }

  FunnyRain.Plugins.ScoreBoard.ScoreManager = ScoreManager;

})(FunnyRain);
