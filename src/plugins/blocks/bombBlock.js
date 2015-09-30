(function (FunnyRain){
  "use strict";

  function BombBlock (id, game, blockType, blockCategory, destroyHandler) {
    FunnyRain.Plugins.Blocks.BaseBlock.call(this,
      id, game, blockType, blockCategory, destroyHandler);

    var _explosionClip = new FunnyRain.Graphics.Widgets.ExplosionClip();

    function adjustBomb (t) {
      t.actor.scale.x = t.actor.scale.y = 0.2;
      t.actor.sprite.rotation = -0.05;
      TweenMax.to(t.actor.sprite, 0.1, {rotation: 0.05, yoyo: true, repeat: -1});
      TweenMax.to(t.actor.scale, 0.15, {x: 0.18, yoyo: true, repeat: -1});
      TweenMax.to(t.actor.scale, 0.15, {y: 0.18, yoyo: true, repeat: -1});
    }

    function scheduleExplosion (t) {
      var bombExplosionSettings = {
        lifeTimeMin: 4000,
        lifeTimeMax: 15000,
      };

      var scoreBoardPlugin = t.getGame().getPluginManager().findPlugin("ScoreBoard");
      var physics = t.getPhysics();
      t.scheduleRandomVisit(
        bombExplosionSettings.lifeTimeMin,
        bombExplosionSettings.lifeTimeMax,
        function() {
          if (physics.getIsPaused()) {
            scheduleExplosion(t);
            return;
          }
          var pos = t.actor.position;
          showExplosion(t, pos);
          physics.explodeBody(t.body);
          scoreBoardPlugin.getScoreManager().changeLives(-1);
        }
      );
    }

    function showExplosion (t, pos) {
      var explosion = _explosionClip.createExplosion(pos);
      var view = t.getGraphics();
      view.createWidget(explosion);
      setTimeout(function(){
        view.destroyWidget(explosion);
      }, 500);
    }

    BombBlock.prototype.adjust = function () {
      adjustBomb.call(this, this);
    };

    BombBlock.prototype.scheduleNextAction = function () {
      scheduleExplosion.call(this, this);
    };

  }

  FunnyRain.Plugins.Blocks.BombBlock =
    Boplex.inherit(BombBlock, FunnyRain.Plugins.Blocks.BaseBlock);

})(FunnyRain);
