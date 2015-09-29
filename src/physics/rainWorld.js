(function (FunnyRain) {
  "use strict";

  function RainWorld (options) {
    var _defaults = {
      canvasSize: {x:1600,y:1200},
      gravity: {x: 0, y: 9.8},
      bodySize: 50,
    };
    var _settings = $.extend( {}, _defaults, options );

    FunnyRain.Physics.BaseWorld.call(this, _settings);

    init(this);

    function init (t) {
      // Create ground and walls
      initStaticScene(t);
    }

    function initStaticScene (t) {
      var sceneSettings = {
        wallSize: 10,
        bottomPadding: 100,
        leftPadding: 0,
        rightPadding: 100,
      };

      // use methods of the base class
      var b2m = t.b2m;
      var createWall = t.createWall;

      //var ground =
      createWall(
        0,
        b2m(_settings.canvasSize.y - sceneSettings.bottomPadding),
        b2m(_settings.canvasSize.x),
        b2m(sceneSettings.wallSize));

      //var leftWall =
      createWall(
        b2m(sceneSettings.leftPadding),
        0,
        b2m(sceneSettings.wallSize),
        b2m(_settings.canvasSize.y));

      //var rightWall =
      createWall(
        b2m(_settings.canvasSize.x-sceneSettings.rightPadding),
        0,
        b2m(sceneSettings.wallSize),
        b2m(_settings.canvasSize.y));

    }

    function createBody (t, xLogical) {
      var bodyOptions = {
        width: _settings.bodySize,
        height: _settings.bodySize,
        x: xLogical || 0,
        y: -60,
        restitution: 0.3,
        friction: 10,
        density: 1,
      };
      var body = t.createDynamicBody(bodyOptions);
      return body;

    }

    RainWorld.prototype.createBody = function (xLogical) {
      return createBody.call(this, this, xLogical);
    };
  }

  FunnyRain.Physics.RainWorld =
    Boplex.inherit(RainWorld, FunnyRain.Physics.BaseWorld);

})(FunnyRain);
