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
