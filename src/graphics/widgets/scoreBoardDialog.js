(function(FunnyRain){
  "use strict";

  function ScoreBoardDialog () {
    var _livesText;
    var _scoreText;

    function createDialog () {
      var dlgSettings = {
        textStyle: {
          font: "240px Courier Bold",
          strokeThickness: 8,
          stroke: "white",
        },
        livesFill: "red",
        scoreFill: "green",
        scoreLeft: 900,
        livesLeft: 500,
        scoreTop: 50,
      };

      var result = new PIXI.Container();

      var textStyleLives = $.extend( {},
        dlgSettings.textStyle,
        {fill: dlgSettings.livesFill} );

      _livesText = new PIXI.Text("", textStyleLives);
      _livesText.position.x = dlgSettings.livesLeft;
      _livesText.position.y = dlgSettings.scoreTop;

      var textStyleScore = $.extend( {},
        dlgSettings.textStyle,
        {fill: dlgSettings.scoreFill} );

      _scoreText = new PIXI.Text("", textStyleScore);
      _scoreText.position.x = dlgSettings.scoreLeft;
      _scoreText.position.y = dlgSettings.scoreTop;

      result.addChild(_livesText);
      result.addChild(_scoreText);
      return result;
    }

    function setScore (x) {
      _scoreText.text = x;
    }

    function setLives (x) {
      _livesText.text = x;
    }

    ScoreBoardDialog.prototype.setScore = function (x) {
      setScore.call(this, x);
    };

    ScoreBoardDialog.prototype.setLives = function (x) {
      setLives.call(this, x);
    };

    ScoreBoardDialog.prototype.createDialog = function () {
      return createDialog.call(this);
    };

  }

  FunnyRain.Graphics.Widgets.ScoreBoardDialog = ScoreBoardDialog;

})(FunnyRain);
