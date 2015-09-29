(function (FunnyRain) {
  "use strict";

  function FallManager (game) {
    /*
    var _defaults = {
      fruitTypes: ["bomb","apple","peach","orange"],
    };
    var _settings = $.extend( {}, _defaults, options );
    */
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
      } else {
        return "fruit";
      }

      return result;
    }

    function createActor (block, imageId) {
      //removeActor(block);
      imageId = imageId || block.type;
      block.actor = _view.createActor(imageId);
    }

    function createBlock (t, x) {
      var category = getRandCategory();
      var block = _blocksFactory.createBlockByCategory(category);
      block.install(t, _physics, _view, x, function(context, block){
        _blocksFactory.destroyBlock(block);
      });
      /*
      block.onDestroy = function(){
        removeBlock(block);
      }
      */
      //block.body = _physics.createBody(x);
      //block.body.block = block;
      //block.actor = view.createActor(block.type);
      //createActor(block);
      //scheduleDestroyBlock(block);
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
      //var scale = _physics.getScale();
      _blocksFactory.forEach(function(block){
        block.step();
        /*
        var pos = block.body.GetPosition();
        block.actor.position.x = pos.x * scale;
        block.actor.position.y = pos.y * scale;
        var angle = block.body.GetAngle();
        */
        //block.actor.rotation = angle;
        //if (!block.x) {
        //  logger.log("pos.x: "+ pos.x);
        //  logger.log("pos.y: "+ pos.y);
        //  block.x = true;
        //}
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
