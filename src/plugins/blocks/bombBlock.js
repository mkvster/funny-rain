(function (FunnyRain){
  "use strict";

  function BombBlock (id, blockType, blockCategory) {
    FunnyRain.Plugins.Blocks.BaseBlock.call(this,
      id, blockType, blockCategory);

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
