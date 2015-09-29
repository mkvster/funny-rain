(function (FunnyRain) {
  "use strict";

  function Game (element) {
    var _element = element;
    var _animFrame = null;
    var _view = null;
    var _rainWorld = null;
    var _isActive = false;
    var _isPaused = false;

    init();

    function init () {
      _rainWorld = new FunnyRain.Physics.RainWorld({onDestroyBody: onDestroyBody});
      _view = new FunnyRain.Graphics.View();
      $(_element).append(_view.getView());
      _animFrame = new FunnyRain.Graphics.AnimFrame(
        onScale,
        onStep);
      $(document).on("dblclick touchstart", onDblClick);
    }

    function onDblClick (e) {
      if (!_isActive) {
        startGame();
        return;
      }

      var block = findBlock(e.clientX, e.clientY);

      if (!block || (block && _isPaused)) {
        togglePause();
      }
      if (block && block.onDblClick) {
        block.onDblClick(e);
      }
    }

    function findBlock (x, y) {
      //TODO Loopby all possible physics to find body
      var physics = _rainWorld;
      var body = physics.findBody(x, y);
      return body.block;
    }

    function stopGame () {
      _isActive = false;
      _isPaused = false;
    }

    function startGame () {
      _isActive = true;
      _isPaused = false;
      _rainWorld.setIsPaused(false);
    }

    function togglePause () {
      _isPaused = !_isPaused;
      _rainWorld.setIsPaused(!_rainWorld.getIsPaused());
    }

    function onScale (scale, w, h) {
      _view.setScale(scale, w, h);
    }

    function onStep () {
      _rainWorld.step();
      _view.step();
    }

    function onDestroyBody (context, body) {
    }
  }

  FunnyRain.Game = Game;

})(FunnyRain);
