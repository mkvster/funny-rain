(function (FunnyRain) {
  "use strict";

  function RocketPlugin (game) {
    FunnyRain.Plugins.BasePlugin.call(this, "Rocket", game);

    var _view = null;
    var _sizeY = 600;
    var _sizeX = 340;
    var _startY = 1200;
    var _velocity = 0;
    var _acceleration = 1;
    var _actor;

    function load (t) {
      _view = t.getGame().getView();
    }

    function createActor (x) {
      _actor = _view.createActor("rocket");
      _actor.scale.x = _actor.scale.y = 1;
      _actor.position.y = _startY;
      _actor.position.x = x - (_sizeX / 2);
    }

    function destroyActor () {
      _view.destroyActor(_actor);
      _actor = null;
      _velocity = 0;
    }

    function launch (x) {
      if (_actor) {
        return;
      }
      createActor(x);
    }

    function step () {
      if (!_actor) {
        return;
      }
      _velocity += _acceleration;
      _actor.position.y -= _velocity;
      if (_actor.position.y < -_sizeY) {
        destroyActor();
      }
    }

    RocketPlugin.prototype.load = function (first_argument) {
      load.call(this, this);
    };

    RocketPlugin.prototype.launch = function (x) {
      launch.call(this, x);
    };

    RocketPlugin.prototype.step = function () {
      step.call(this);
    };
  }

  FunnyRain.Plugins.Rocket.RocketPlugin =
    Boplex.inherit(RocketPlugin, FunnyRain.Plugins.BasePlugin);

})(FunnyRain);
