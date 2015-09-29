(function(FunnyRain){
  "use strict";

  function BaseBlock (id, blockType, blockCategory, options) {
    var _defaults = {

    };
    var _settings = $.extend( {}, _defaults, options );

    var _id = id;
    this.type = blockType;
    var _category = blockCategory;

    this.body = null;
    this.actor = null;

    var _owner;
    var _physics;
    var _graphics;
    this.timeout;
    var _onDestroy;

    //init();
    //function init(){
    //
    //}

    function install (t, owner, physics, graphics, x, _onDestroy) {
      _owner = owner;
      _physics = physics;
      _graphics = graphics;
      t.body = _physics.createBody(x);
      t.body.block = t;
      t.actor = _graphics.createActor(t.type);
      t.adjust();
      t.scheduleDestroy();
    }

    function adjust (t) {
      var scale = 0.2;
      t.actor.scale.x = t.actor.scale.y = scale;
    }

    function scheduleDestroy (t) {
      var blockDestroySettings = {
        lifeTimeMin: 10000,
        lifeTimeMax: 50000,
      };

      var lifeTime = Boplex.random(
        blockDestroySettings.lifeTimeMin,
        blockDestroySettings.lifeTimeMax);

      t.timeout = setTimeout(function(){
        if (_owner.getIsEnabled()) {
          t.timeout = null;
          if (_physics.getIsPaused()) {
            scheduleDestroy(t);
            return;
          }
          _physics.destroyBody(t.body);
        }
      }, lifeTime);

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
      //var isBomb = block.type === 'bomb';
      //if (block.isResolved) {
      //  var prize = isBomb ? 5 : 1;
      //  incScore(prize);
      //}
      //else if (isBomb) {
      //  decLives(1);
      //}
      /*
      var parent = block.actor.parent;
      if (parent) {
        parent.removeChild(block.actor);
      }
      */
      //removeActor(t);
      /*
      var blockList = status.getBlockList();
      for(var i = 0; i < blockList.length; i++){
        if (block === blockList[i]) {
          blockList.splice(i,1);
          break;
        }
      }
      */
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
      //var angle = t.body.GetAngle();

    }

    function onDblClick (t, e) {
      resolveBlock(t, e);
    }

    function resolveBlock (block, e) {
      var wasResolved = block.isResolved;
      block.isResolved = true;
      /*
      if (block.type === "bomb" && !wasResolved) {
        stopBomb(block);
        return;
      }
      */
      var blockGroup = collectGroup(block, e);
      blockGroup.forEach(function(body){
        //body.group = null;
        //body.resolveBlock = true;
        _physics.destroyBody(body);
      });
      //if (blockGroup.length > 2) {
      //  lunchRocket(e.clientX - 60);
      //}
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
