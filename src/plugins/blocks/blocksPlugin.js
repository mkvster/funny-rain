(function (FunnyRain) {
  "use strict";

  function BlocksPlugin (game) {
    FunnyRain.Plugins.BasePlugin.call(this, "Blocks", game);

    var _blocksFactory = null;

    init(this);

    function init (t) {
      _blocksFactory = new FunnyRain.Plugins.Blocks.BlocksFactory();
    }


    BlocksPlugin.prototype.getBlocksFactory = function () {
      return _blocksFactory;
    };
  }

  FunnyRain.Plugins.Blocks.BlocksPlugin =
    Boplex.inherit(BlocksPlugin, FunnyRain.Plugins.BasePlugin);

})(FunnyRain);