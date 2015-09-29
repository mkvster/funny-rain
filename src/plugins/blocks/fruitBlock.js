(function(target){
  "use strict";

  function FruitBlock (id, blockType, blockCategory, options) {
    var _defaults = {

    };
    var _settings = $.extend( {}, _defaults, options );

    FunnyRain.Plugins.Blocks.BaseBlock.call(this,
      id, blockType, blockCategory, _settings);

    init(this);
    function init (t) {
      t.scale = 0.2;
    }

  }

  FunnyRain.Plugins.Blocks.FruitBlock =
    Boplex.inherit(FruitBlock, FunnyRain.Plugins.Blocks.BaseBlock);

})(FunnyRain.Plugins.Blocks);
