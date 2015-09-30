(function (FunnyRain) {
  "use strict";

  function BlocksPlugin (game) {
    FunnyRain.Plugins.BasePlugin.call(this, "Blocks", game);

    var _blocksFactory = null;

    init(this);

    function init (t) {
      _blocksFactory = new FunnyRain.Plugins.Blocks.BlocksFactory(t.getGame());
    }

    BlocksPlugin.prototype.getBlocksFactory = function () {
      return _blocksFactory;
    };

    BlocksPlugin.prototype.enable = function (isEnabled) {
      _blocksFactory.enable(isEnabled);
    };
  }

  FunnyRain.Plugins.Blocks.BlocksPlugin =
    Boplex.inherit(BlocksPlugin, FunnyRain.Plugins.BasePlugin);

})(FunnyRain);
