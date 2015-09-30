var $ = {};
var TweenMax = {};
var PIXI = {};
var Box2D = {};

"use strict";
var Boplex = {};

(function(Boplex){

  var _version = "0.0.3";

  function getFuncName(f){
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec(f);
    return (results && results.length > 1) ? results[1] : "";
  }

  function include(x, child, className){
    x[className] = child;
  }

  function inherit(child, parent){
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
    return child;
  }

  function getLogTime(currentdate){
    currentdate = currentdate || (new Date());
    var datetime = currentdate.getFullYear() +
      "." + (currentdate.getMonth()+1)  +
      "." + currentdate.getDate() +
      "_" + currentdate.getHours() +
      ":" + currentdate.getMinutes() +
      ":" + currentdate.getSeconds();
    return datetime;
  }

  function defineConstProp(x, propName, propVal){
    Object.defineProperty(x, propName, {
      writable: false,
      value: propVal,
    });
  }

  function random(a, b){
    return a + Math.round(Math.random()*(b - a));
  }

  function publish(x){
    x.getFuncName = getFuncName;
    x.defineConstProp = defineConstProp;
    x.include = include;
    x.inherit = inherit;
    x.getLogTime = getLogTime;
    x.random = random;
  }

  defineConstProp(Boplex, "Version", _version);
  publish(Boplex);

})(Boplex);

(function(target){
  "use strict";

  function BaseObject() {
    "obsolete";
  }

  function publish(x){
    x.BaseObject = BaseObject;
  }

  publish(target);

})(Boplex);

(function(Boplex){
  "use strict";

  function Logger(name){
    var _name = name;

    Logger.prototype.log = function(txt){
      console.log(Boplex.getLogTime() + " " + _name + " " + txt);
    };
  }

  function publish(x){
    x.Logger = Logger;
  }

  publish(Boplex);

})(Boplex);

(function(Boplex){
  "use strict";

  function Event(context, handler){
    var _context = context;
    var _handler = handler;

    Event.prototype.raise = function (args) {
      if (!_handler){
        return;
      }
      _handler(_context, args);
    };
  }

  function publish(x){
    x.Event = Event;
  }

  publish(Boplex);

})(Boplex);

"use strict";
var FunnyRain = {};
(function (FunnyRain) {

  Boplex.defineConstProp(FunnyRain, "Version", "0.0.1");
  FunnyRain.Physics = {};
  FunnyRain.Graphics = {};
  FunnyRain.Graphics.Widgets = {};
  FunnyRain.Plugins = {};
  FunnyRain.Plugins.Blocks = {};
  FunnyRain.Plugins.FallingThings = {};
  FunnyRain.Plugins.ScoreBoard = {};

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

    function createWidget (widget) {
      _scene.addChild(widget);
      return widget;      
    }

    function destroyWidget (widget) {
      destroyActor(widget);
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

    View.prototype.createWidget = function (widget) {
      return createWidget.call(this, widget);
    };

    View.prototype.destroyWidget = function (widget) {
      return destroyWidget.call(this, widget);
    };
  }

  FunnyRain.Graphics.View = View;

})(FunnyRain);

(function (FunnyRain) {
  "use strict";

  function PluginManager (game) {
    var _game = game;
    var _pluginList = [];

    init();

    function init () {
      var createdPlugins = createPlugins();
      _pluginList = _pluginList.concat(createdPlugins);
    }

    function createPlugins () {
      var result = [
        new FunnyRain.Plugins.ScoreBoard.ScoreBoardPlugin(_game),
        new FunnyRain.Plugins.Blocks.BlocksPlugin(_game),
        new FunnyRain.Plugins.FallingThings.FallingThingsPlugin(_game),
      ];
      return result;
    }

    function forEachPlugin (isForward, fn) {
      var len = _pluginList.length;
      var index = isForward ? 0 : len - 1;
      var result = null;
      while (!result && (index > -1 && index < len)) {
        result = fn(_pluginList[index]);
        index = isForward ? index + 1 : index - 1;
      }
      return result;
    }

    function load () {
      forEachPlugin(true, function (plugin) {
        if (plugin.load) {
          plugin.load();
        }
      });
    }

    function step () {
      forEachPlugin(true, function (plugin) {
        if (plugin.step) {
          plugin.step();
        }
      });
    }

    function enable (isEnabled) {
      forEachPlugin(isEnabled, function (plugin) {
        if (plugin.enable) {
          plugin.enable(isEnabled);
        }
      });
    }

    function findPlugin (id) {
      var found = forEachPlugin(false, function (plugin) {
        if (id === plugin.getPluginId()) {
          return plugin;
        }
      });
      return found;
    }

    PluginManager.prototype.load = function () {
      load.call(this);
    };

    PluginManager.prototype.step = function () {
      step.call(this);
    };

    PluginManager.prototype.enable = function (isEnabled) {
      enable.call(this, isEnabled);
    };

    PluginManager.prototype.findPlugin = function (id) {
      return findPlugin.call(this, id);
    };
  }

  FunnyRain.Plugins.PluginManager = PluginManager;

})(FunnyRain);

(function (FunnyRain) {
  "use strict";

  function BasePlugin (id, game) {
    this._id = id;
    var _game = game;

    function getId (t) {
      return t._id;
    }

    function getGame () {
      return _game;
    }

    BasePlugin.prototype.getPluginId = function () {
      return getId.call(this, this);
    };

    BasePlugin.prototype.getGame = function () {
      return getGame.call(this);
    };
  }

  FunnyRain.Plugins.BasePlugin = BasePlugin;

})(FunnyRain);

(function (FunnyRain) {
  "use strict";

  function BlocksPlugin (game) {
    FunnyRain.Plugins.BasePlugin.call(this, "Blocks", game);

    var _blocksFactory = null;

    init(this);

    function init (t) {
      _blocksFactory = new FunnyRain.Plugins.Blocks.BlocksFactory(t.getGame());
    }


    BlocksPlugin.prototype.getBlocksFactory = function () {
      return _blocksFactory;
    };
  }

  FunnyRain.Plugins.Blocks.BlocksPlugin =
    Boplex.inherit(BlocksPlugin, FunnyRain.Plugins.BasePlugin);

})(FunnyRain);

(function (FunnyRain) {
  "use strict";

  function BlocksFactory (game) {
    var _game = game;
    var _blockClassList = [
      {
        blockCategory: "fruit",
        blockClass: FunnyRain.Plugins.Blocks.FruitBlock,
        blockTypes: ["apple","peach","orange"]
      },
      {
        blockCategory: "bomb",
        blockClass: FunnyRain.Plugins.Blocks.BombBlock,
        blockTypes: ["bomb"]
      }
    ];

    var _nextId;
    var _blockList = [];

    init();
    function init () {
      _nextId = 0;
    }


    function findBlockCategory (blockCategory) {
      for(var i = 0; i < _blockClassList.length; i++) {
        var blockClassRecord = _blockClassList[i];
        if(blockClassRecord.blockCategory === blockCategory) {
          return blockClassRecord;
        }
      }
      return null;
    }

    function createBlock (blockCategoryRecord, blockTypeIndex) {
      var blockId = ++_nextId;

      var block = new blockCategoryRecord.blockClass(blockId,
        _game,
        blockCategoryRecord.blockTypes[blockTypeIndex],
        blockCategoryRecord.blockCategory, function(context, block){
          destroyBlock(block);
        });

      _blockList.push(block);
      return block;
    }

    function createRandomBlock (blockCategoryRecord) {
      var blockTypeIndex = Boplex.random(0,
        blockCategoryRecord.blockTypes.length-1);

      return createBlock(blockCategoryRecord, blockTypeIndex);
    }

    function createBlockByCategory (blockCategory) {
      var blockCategoryRecord = findBlockCategory(blockCategory);
      if (!blockCategoryRecord) {
        throw new RangeError(blockCategory + " - unknown block category");
      }
      return createRandomBlock(blockCategoryRecord);
    }

    function destroyBlock (block) {
      for(var i = 0; i < _blockList.length; i++){
        if (block === _blockList[i]) {
          _blockList.splice(i,1);
          break;
        }
      }
    }

    BlocksFactory.prototype.createBlockByCategory = function (blockCategory) {
      return createBlockByCategory.call(this, blockCategory);
    };

    BlocksFactory.prototype.forEach = function (handler) {
      _blockList.forEach(handler);
    };

    BlocksFactory.prototype.destroyBlock = function (block) {
      destroyBlock.call(this, block);
    };
  }

  FunnyRain.Plugins.Blocks.BlocksFactory = BlocksFactory;

})(FunnyRain);

(function(FunnyRain){
  "use strict";

  function BaseBlock (id, game, blockType, blockCategory, destroyHandler) {

    var _id = id;
    var _game = game;
    this.type = blockType;
    var _category = blockCategory;

    this.body = null;
    this.actor = null;

    var _owner;
    var _physics;
    var _graphics;
    this.timeout;
    var _onDestroy = destroyHandler;

    //init();
    //function init(){
    //
    //}

    function install (t, owner, physics, graphics, x) {
      _owner = owner;
      _physics = physics;
      _graphics = graphics;
      t.body = _physics.createBody(x);
      t.body.block = t;
      t.actor = _graphics.createActor(t.type);
      t.adjust();
      t.scheduleNextAction();
    }

    function adjust (t) {
      var scale = 0.2;
      t.actor.scale.x = t.actor.scale.y = scale;
    }

    function scheduleVisit (t, timeInterval, fn) {

      t.timeout = setTimeout(function(){
        if (_owner.getIsEnabled()) {
          t.timeout = null;
          fn(t);
        }
      }, timeInterval);

    }

    function scheduleRandomVisit (t, timeIntervalMin, timeIntervalMax, fn) {
      var timeInterval = Boplex.random(
        timeIntervalMin,
        timeIntervalMax);

      scheduleVisit(t, timeInterval, fn);
    }

    function scheduleDestroy (t) {
      var blockDestroySettings = {
        lifeTimeMin: 10000,
        lifeTimeMax: 50000,
      };

      scheduleRandomVisit(
        t,
        blockDestroySettings.lifeTimeMin,
        blockDestroySettings.lifeTimeMax,
        function() {
          if (_physics.getIsPaused()) {
            scheduleDestroy(t);
            return;
          }
          _physics.destroyBody(t.body);
        }
      );
    }

    function scheduleNextAction (t) {
      scheduleDestroy(t);
    }

    function onDestroy (t) {
      removeBlock(t);
      removeActor(t);
      (new Boplex.Event(t, _onDestroy).raise(t));
    }

    function removeBlock (t) {
      var timeout = t.timeout;
      if (timeout) {
        clearTimeout(timeout);
      }
    }

    function removeActor (t) {
      if (!t.actor) {
        return;
      }
      _graphics.destroyActor(t.actor);
      t.actor = null;
    }

    function step (t) {
      if (!(t.body && t.actor)) {
        return;
      }
      var scale = _physics.getScale();
      var pos = t.body.GetPosition();
      t.actor.position.x = pos.x * scale;
      t.actor.position.y = pos.y * scale;
    }

    function onDblClick (t, e) {
      resolveBlock(t, e);
    }

    function resolveBlock (block, e) {
      var wasResolved = block.isResolved;
      block.isResolved = true;
      var blockGroup = collectGroup(block, e);
      blockGroup.forEach(function(body){
        _physics.destroyBody(body);
      });
      var scoreBoardPlugin = _game.getPluginManager().findPlugin("ScoreBoard");
      scoreBoardPlugin.getScoreManager().changeScore(blockGroup.length);
    }

    function collectGroup (block, e) {
      return _physics.getMatchGroup(
        block.body,
        function(other){
          if(other.block) {
            return block.compareGroup(other.block);
          }
        });
    }

    function compareGroup (block, otherBlock) {
      return block.type === otherBlock.type;
    }

    function getGame () {
      return _game;
    }

    BaseBlock.prototype.getGame = function () {
      return getGame.call(this);
    };

    BaseBlock.prototype.install = function (owner, physics, graphics, x) {
      install.call(this, this, owner, physics, graphics, x);
    };

    BaseBlock.prototype.adjust = function () {
      adjust.call(this, this);
    };

    BaseBlock.prototype.adjust = function () {
      adjust.call(this, this);
    };

    BaseBlock.prototype.scheduleDestroy = function () {
      scheduleDestroy.call(this, this);
    };

    BaseBlock.prototype.scheduleNextAction = function () {
      scheduleNextAction.call(this, this);
    };

    BaseBlock.prototype.onDestroy = function () {
      onDestroy.call(this, this);
    };

    BaseBlock.prototype.step = function () {
      step.call(this, this);
    };

    BaseBlock.prototype.onDblClick = function (e) {
      onDblClick.call(this, this, e);
    };

    BaseBlock.prototype.compareGroup = function (otherBlock) {
      return compareGroup.call(this, this, otherBlock);
    };

  }

  FunnyRain.Plugins.Blocks.BaseBlock = BaseBlock;

})(FunnyRain);

(function(FunnyRain){
  "use strict";

  function FruitBlock (id, game, blockType, blockCategory, destroyHandler) {
    FunnyRain.Plugins.Blocks.BaseBlock.call(this,
      id, game, blockType, blockCategory, destroyHandler);

    init(this);
    function init (t) {
      t.scale = 0.2;
    }

  }

  FunnyRain.Plugins.Blocks.FruitBlock =
    Boplex.inherit(FruitBlock, FunnyRain.Plugins.Blocks.BaseBlock);

})(FunnyRain);

(function (FunnyRain){
  "use strict";

  function BombBlock (id, game, blockType, blockCategory, destroyHandler) {
    FunnyRain.Plugins.Blocks.BaseBlock.call(this,
      id, game, blockType, blockCategory, destroyHandler);

    function adjustBomb (t) {
      t.actor.scale.x = t.actor.scale.y = 0.2;
      t.actor.sprite.rotation = -0.05;
      TweenMax.to(t.actor.sprite, 0.1, {rotation: 0.05, yoyo: true, repeat: -1});
      TweenMax.to(t.actor.scale, 0.15, {x: 0.18, yoyo: true, repeat: -1});
      TweenMax.to(t.actor.scale, 0.15, {y: 0.18, yoyo: true, repeat: -1});
    }

    BombBlock.prototype.adjust = function () {
      adjustBomb.call(this, this);
    };

  }

  FunnyRain.Plugins.Blocks.BombBlock =
    Boplex.inherit(BombBlock, FunnyRain.Plugins.Blocks.BaseBlock);

})(FunnyRain);

(function (FunnyRain) {
  "use strict";

  function FallingThingsPlugin (game) {
    FunnyRain.Plugins.BasePlugin.call(this, "FallingThings", game);

    var _FallManager = null;

    init(this);

    function init (t) {
      _FallManager = new FunnyRain.Plugins.FallingThings.FallManager(t.getGame());
    }

    FallingThingsPlugin.prototype.load = function () {
      _FallManager.load();
    };

    FallingThingsPlugin.prototype.getFallManager = function () {
      return _FallManager;
    };

    FallingThingsPlugin.prototype.enable = function (isEnabled) {
      _FallManager.enable(isEnabled);
    };

    FallingThingsPlugin.prototype.step = function () {
      _FallManager.step();
    };
  }

  FunnyRain.Plugins.FallingThings.FallingThingsPlugin =
    Boplex.inherit(FallingThingsPlugin, FunnyRain.Plugins.BasePlugin);

})(FunnyRain);

(function (FunnyRain) {
  "use strict";

  function FallManager (game) {
    var _game = game;

    var _isEnabled;
    var _blocksFactory;
    var _physics;
    var _view;

    init();
    function init () {
    }

    function load () {
      _physics = _game.getRainWorld();
      _view = _game.getView();
      var blocksPlugin = _game.getPluginManager().findPlugin("Blocks");
      _blocksFactory = blocksPlugin.getBlocksFactory();
    }

    function getRandCategory () {
      var probabilitySettings = {
        bomb: 25,
        max: 100
      };
      var x = Boplex.random(0, probabilitySettings.max);
      if (x < probabilitySettings.bomb) {
        return "bomb";
      }
      return "fruit";
    }

    function createActor (block, imageId) {
      //removeActor(block);
      imageId = imageId || block.type;
      block.actor = _view.createActor(imageId);
    }

    function createBlock (t, x) {
      var category = getRandCategory();
      var block = _blocksFactory.createBlockByCategory(category);
      block.install(t, _physics, _view, x);
    }

    function loopCreateBlock (t) {
      var blockCreateSettings = {
        fallWidth: 60*20,
        leftPadding: 50,
        nextTimeMin: 500,
        nextTimeMax: 1000,
      };

      var nextX = blockCreateSettings.leftPadding +
        Boplex.random(0, blockCreateSettings.fallWidth);

      var nextTime = Boplex.random(
        blockCreateSettings.nextTimeMin,
        blockCreateSettings.nextTimeMax);

      if (_isEnabled) {
        if (!_physics.getIsPaused()) {
          createBlock(t, nextX);
        }
        setTimeout(function(){
          loopCreateBlock(t);
        }, nextTime);
      }
    }

    function enable (t,isEnabled) {
      if (isEnabled === _isEnabled) {
        return;
      }
      _isEnabled = isEnabled;
      if (_isEnabled) {
        loopCreateBlock(t);
      }
    }

    function step () {
      if (!_blocksFactory) {
        return;
      }
      _blocksFactory.forEach(function(block){
        block.step();
      });
    }

    FallManager.prototype.load = function (first_argument) {
      load.call(this);
    };

    FallManager.prototype.enable = function (isEnabled) {
      enable.call(this, this, isEnabled);
    };

    FallManager.prototype.getIsEnabled = function () {
      return _isEnabled;
    };

    FallManager.prototype.step = function () {
      step.call(this);
    };
  }
  FunnyRain.Plugins.FallingThings.FallManager = FallManager;

})(FunnyRain);

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

console.log("Testing FunnyRain... ");

console.log("FunnyRain content");
console.dir(FunnyRain);

console.log("Test completed!");
