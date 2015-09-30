(function(FunnyRain){
  "use strict";

  function ScoreBoardDialog () {
    var _livesText;
    var _scoreText;

    function createDialog () {
      var dlgSettings = {
        font: "240px Courier Bold",
        scoreLeft: 900,
        livesLeft: 500,
        scoreTop: 50,
      };

      var result = new PIXI.Container();

      _livesText = new PIXI.Text("", {font: dlgSettings.font, fill: "red"});
      _livesText.position.x = dlgSettings.livesLeft;
      _livesText.position.y = dlgSettings.scoreTop;

      _scoreText = new PIXI.Text("", {font: dlgSettings.font, fill: "green"});
      _scoreText.position.x = dlgSettings.scoreLeft;
      _scoreText.position.y = dlgSettings.scoreTop;

      result.addChild(livesText);
      result.addChild(scoreText);
      return result;
    }

    function setScore (x) {
      _scoreText.text = x;
    }

    function setLives (x) {
      _livesText.text = x;
    }

  }

  FunnyRain.Graphics.Widgets.ScoreBoardDialog = ScoreBoardDialog;

})(FunnyRain);
