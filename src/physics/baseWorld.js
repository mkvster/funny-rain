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
