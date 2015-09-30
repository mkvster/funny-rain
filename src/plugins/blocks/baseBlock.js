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

    function destroy (t) {
      _physics.destroyBody(t.body);
    }

    BaseBlock.prototype.getGame = function () {
      return getGame.call(this);
    };

    BaseBlock.prototype.getPhysics = function () {
      return _physics;
    };

    BaseBlock.prototype.install = function (owner, physics, graphics, x) {
      install.call(this, this, owner, physics, graphics, x);
    };

    BaseBlock.prototype.adjust = function () {
      adjust.call(this, this);
    };

    BaseBlock.prototype.destroy = function () {
      destroy.call(this, this);
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

    BaseBlock.prototype.scheduleRandomVisit =
    function (timeIntervalMin, timeIntervalMax, fn) {
      return scheduleRandomVisit.call(this, this, timeIntervalMin,
          timeIntervalMax, fn);
    };

  }

  FunnyRain.Plugins.Blocks.BaseBlock = BaseBlock;

})(FunnyRain);
