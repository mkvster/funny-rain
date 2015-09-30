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
