"use strict";
var FunnyRain = {};
(function (FunnyRain) {

  Boplex.defineConstProp(FunnyRain, "Version", "0.0.1");
  FunnyRain.Physics = {};
  FunnyRain.Graphics = {};

})(FunnyRain);

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

(function (FunnyRain) {

  "use strict";

  function BaseWorld (options) {

    var _logger = new Boplex.Logger("FunnyRain.Physics.BaseWorld");
    var _defaults = {
      RATIO: 50,
      gravity: {x: 0, y: 0},
      onDestroyBody: null,
    };

    var _settings = $.extend( {}, _defaults, options );
    var _world;
    var _destroyBodies = [];
    var _onDestroyBody = _settings.onDestroyBody;
    var _isPaused = false;

    init();

    function init () {
      // _world
      var gravity = new Box2D.Common.Math.b2Vec2(
        _settings.gravity.x,
        _settings.gravity.y);

      _world = new Box2D.Dynamics.b2World(gravity, true);
    }

    function b2m (value) {
      return value / _settings.RATIO;
    }

    function createDynamicBody (bodyOptions) {
      var bodyDefaults = {
        width: 50,
        height: 50,
        x: 0,
        y: -60,
        restitution: 0.3,
        friction: 10,
        density: 1,
      };
      var bodySettings = $.extend( {}, bodyDefaults, bodyOptions );

      // body
      var bodyDef = new Box2D.Dynamics.b2BodyDef();
      bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
      bodyDef.position.Set(b2m(bodySettings.x), b2m(bodySettings.y));
      var body = _world.CreateBody(bodyDef);

      // fixture
      var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
      fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
      fixtureDef.shape.SetAsBox(
        b2m(bodySettings.width),
        b2m(bodySettings.height));
      fixtureDef.density = bodySettings.density;
      fixtureDef.restitution = bodySettings.restitution;
      fixtureDef.friction = bodySettings.friction;
      body.CreateFixture(fixtureDef);

      return body;
    }

    function createWall (x, y, w, h) {
      // body
      var bodyDef = new Box2D.Dynamics.b2BodyDef();
      bodyDef.position.Set(x, y);
      var wall = _world.CreateBody(bodyDef);

      // fixture
      var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
      fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
      fixtureDef.shape.SetAsBox(w, h);
      fixtureDef.density = 1;
      wall.CreateFixture(fixtureDef);
      return wall;
    }

    function step () {
      var stepSettings = {
        timeStep: 1/60,
        velocityIterations: 8,
        positionIterations: 4
      };
      var timeStep = stepSettings.timeStep;
      if (_isPaused) {
        timeStep = 0;
      }
      _world.Step(
        timeStep,
        stepSettings.velocityIterations,
        stepSettings.positionIterations);
      _world.DrawDebugData();
      _world.ClearForces();
      clearDestroyedBodies();
    }

    function setScale (scale) {
      //_settings.RATIO = _settings.RATIO / scale;
    }

    function setIsPaused (p) {
      _isPaused = p;
    }

    function getIsPaused () {
      return _isPaused;
    }

    function getScale () {
      return _settings.RATIO;
    }

    function clearDestroyedBodies () {
      _destroyBodies.forEach(function(body){
        _world.DestroyBody(body);
      });
      _destroyBodies = [];
    }

    function destroyBody (body) {
      (new Boplex.Event(null, _onDestroyBody)).raise(body);
      _destroyBodies.push(body);
    }

    function createAabb (position, radius) {
      var aabb = new Box2D.Collision.b2AABB();
      aabb.lowerBound.Set(
        position.x - radius,
        position.y - radius);
      aabb.upperBound.Set(
        position.x + radius,
        position.y + radius);
      return aabb;
    }

    function isInside (body, pt) {
      var insideSettings = {
        size: _settings.bodySize,
      };
      var pos = body.GetPosition();
      return pt.x >= pos.x &&
        pt.x <= pos.x + insideSettings.size &&
        pt.y >= pos.y &&
        pt.y <= pos.y + insideSettings.size;
    }

    function findBody (x, y) {
      var findSettings = {
        radius: _settings.bodySize,
      };
      var position = new Box2D.Common.Math.b2Vec2(
        b2m(x), b2m(y));
      var aabb = createAabb(position,
        b2m(findSettings.radius));

      var result;
      _world.QueryAABB(function(fixture){
        var currentBody = fixture.GetBody();
        if(currentBody.GetType() === Box2D.Dynamics.b2Body.b2_dynamicBody) {
          //if (fixture.GetShape().TestPoint(currentBody.GetTransform(), position)) {
          if (isInside(currentBody, position)) {
            result = currentBody;
            return false;
          }
        }
        return true;
      }, aabb);
      return result;
    }

    function getMatchGroup (body, filter) {
      var result = [body];
      body.group = result;

      function matchOther (x) {
        var edge = x.GetContactList();
        while (edge) {
          var other = edge.other;
          if (!other.group && filter(other, body)) {
            result.push(other);
            other.group = result;
            matchOther(other);
          }
          edge = edge.next;
        }
      }
      matchOther(body);
      return result;
    }

    BaseWorld.prototype.b2m = function (x) {
      return b2m.call(this, x);
    };

    BaseWorld.prototype.getBox2dWorld = function () {
      return _world;
    };

    BaseWorld.prototype.setIsPaused = function (value) {
      setIsPaused.call(this, value);
    };

    BaseWorld.prototype.getIsPaused = function () {
      return getIsPaused.call(this);
    };

    BaseWorld.prototype.step = function () {
      step.call(this);
    };

    BaseWorld.prototype.getScale = function () {
      return getScale.call(this);
    };

    BaseWorld.prototype.createWall = function (x, y, w, h) {
      return createWall.call(this, x, y, w, h);
    };

    BaseWorld.prototype.createDynamicBody = function (bodyOptions) {
      return createDynamicBody.call(this, bodyOptions);
    };

    BaseWorld.prototype.findBody = function (x, y) {
      return findBody.call(this, x, y);
    };

    BaseWorld.prototype.destroyBody = function (body) {
      return destroyBody.call(this, body);
    };

    BaseWorld.prototype.getMatchGroup = function (body, compareGroup) {
      return getMatchGroup.call(this, body, compareGroup);
    };
  }

  FunnyRain.Physics.BaseWorld = BaseWorld;

})(FunnyRain);

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

(function (FunnyRain) {
  "use strict";

  function AnimFrame (onScale, onStep, options) {

    var _onScale = onScale;
    var _onStep = onStep;
    var _logger = new Boplex.Logger("FunnyRain.AnimFrame");
    var _defaults = {
      canvasSize: {x:1600,y:1200},
      dpr: window.devicePixelRatio,
    };

    var _settings = $.extend( {}, _defaults, options );

    (function () {
      animate();
      $(window).on("resize deviceOrientation", onResized);
      $(window).trigger("resize");
    })();

    function onResized () {
      var w = $(window).innerWidth();
      var h = $(window).innerHeight();
      resize(w, h);
    }

    window.requestAnimFrame = (function() {
      return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    function animate () {
      requestAnimationFrame(animate);
      _onStep();
    }

    function resize (width, height) {
      var targetScale = 1;

      var cv = _settings.canvasSize;
      var scale_x = width/cv.x;
      var scale_y = height/cv.y;

      if(scale_x > 1 || scale_y > 1) {
        targetScale = 1;
      }else{
        if(scale_y > scale_x){
          targetScale = scale_x;
        }else{
          targetScale = scale_y;
        }
      }

      var w = targetScale * cv.x;
      var h = targetScale * cv.y;

      _onScale(targetScale, w, h);
    }

  }

  FunnyRain.Graphics.AnimFrame = AnimFrame;

})(FunnyRain);

(function (FunnyRain) {
  "use strict";

  function View (options) {

    var _logger = new Boplex.Logger("FunnyRain.Graphics.View");
    var _defaults = {
      canvasSize: {x:1600,y:1200},
      backgroundColor: 0x1099bb,
      assetsDir: "assets/",
      backgroundImage: "background",
    };
    var _settings = $.extend( {}, _defaults, options );
    var _renderer;
    var _scene;
    var _dialog;

    init();

    function getPngUrl (name) {
      var result = _settings.assetsDir + name + ".png";
      return result;
    }

    function init () {
      _renderer = PIXI.autoDetectRenderer(
        _settings.canvasSize.x,
        _settings.canvasSize.y,
        {backgroundColor : _settings.backgroundColor});

      _scene = createContainer(_settings.backgroundImage);

      initDialog();
    }

    function initDialog () {

    }

    function createSprite (imageId) {
      var url = getPngUrl(imageId);
      var sprite = new PIXI.Sprite.fromImage(url);
      return sprite;
    }

    function createContainer (imageId) {
      var sprite = createSprite(imageId);
      var result = new PIXI.Container();
      result.addChild(sprite);
      result.sprite = sprite;
      return result;
    }

    function createActor (imageId) {
      var result = createContainer(imageId);
      _scene.addChild(result);
      return result;
    }

    function destroyActor (actor) {
      if (!actor) {
        return;
      }
      var parent = actor.parent;
      if (parent) {
        parent.removeChild(actor);
      }
    }

    function getSprite (actor) {
      return actor.sprite;
    }

    function getView () {
      return _renderer.view;
    }

    function setScale (scale, w, h) {
      _scene.scale.x = _scene.scale.y = scale;
      _renderer.resize(w,h);
    }

    function getScale () {
      return _scene.scale.x;
    }

    function step () {
      _renderer.render(_scene);
    }

    View.prototype.step = function () {
      step.call(this);
    };

    View.prototype.setScale = function (scale, w, h) {
      setScale.call(this, scale, w, h);
    };

    View.prototype.getView = function () {
      return getView.call(this);
    };

    View.prototype.createActor = function (imageId) {
      return createActor.call(this, imageId);
    };

    View.prototype.destroyActor = function (actor) {
      return destroyActor.call(this, actor);
    };
  }

  FunnyRain.Graphics.View = View;

})(FunnyRain);
