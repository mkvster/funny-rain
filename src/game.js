(function (FunnyRain) {
  "use strict";

  function Game (element) {
    var _element = element;
    var _animFrame = null;
    var _view = null;
    var _rainWorld = null;
    var _isActive = false;
    var _isPaused = false;
    var _pluginManager = null;

    init(this);

    function init (t) {
      _rainWorld = new FunnyRain.Physics.RainWorld({onDestroyBody: onDestroyBody});
      _view = new FunnyRain.Graphics.View();
      _pluginManager = new FunnyRain.Plugins.PluginManager(t);
      if ($(_element).length > 0) {
        $(_element).append(_view.getView());
        _animFrame = new FunnyRain.Graphics.AnimFrame(
          onScale,
          onStep);
        $(document).on("dblclick touchstart", onDblClick);
      }
    }

    function adaptForTouchEvent (e) {
      if ("clientX" in e) {
        return;
      }

      if (e.originalEvent.changedTouches) {
        var touches = e.originalEvent.changedTouches;
        for (var i = 0; i < touches.length; i++) {
          e.clientX = Math.round(touches[i].pageX);
          e.clientY = Math.round(touches[i].pageY);
          break;
        }
      }
    }
    
    function onDblClick (e) {
      if (!_isActive) {
        startGame();
        return;
      }

      adaptForTouchEvent(e);
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
      return body ? body.block : null;
    }

    function stopGame () {
      _isActive = false;
      _isPaused = false;
      _pluginManager.enable(false);
    }

    function startGame () {
      _isActive = true;
      _isPaused = false;
      _rainWorld.setIsPaused(false);
      _pluginManager.enable(true);
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
      _pluginManager.step();
      _view.step();
    }

    function onDestroyBody (context, body) {
      var block = body.block;
      if (block && block.onDestroy) {
        block.onDestroy();
      }
    }

    Game.prototype.getPluginManager = function () {
      return _pluginManager;
    };

    Game.prototype.getView = function () {
      return _view;
    };

    Game.prototype.getRainWorld = function () {
      return _rainWorld;
    };

    (function(){
      _pluginManager.load();
      startGame();
    })();
  }

  FunnyRain.Game = Game;

})(FunnyRain);
