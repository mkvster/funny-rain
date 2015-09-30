(function(FunnyRain){
  "use strict";

  function FruitBlock (id, blockType, blockCategory) {
    FunnyRain.Plugins.Blocks.BaseBlock.call(this,
      id, blockType, blockCategory);

    init(this);
    function init (t) {
      t.scale = 0.2;
    }

  }

  FunnyRain.Plugins.Blocks.FruitBlock =
    Boplex.inherit(FruitBlock, FunnyRain.Plugins.Blocks.BaseBlock);

})(FunnyRain);
