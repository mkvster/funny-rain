(function (FunnyRain) {
  "use strict";

  function PluginManager (game) {
    var _game = game;
    var _pluginList = [];

    init();

    function init () {
      var createdPlugins = createPlugins();
      _pluginList = _pluginList.concat(createdPlugins);
    }

    function createPlugins () {
      var result = [
        new FunnyRain.Plugins.Rocket.RocketPlugin(_game),
        new FunnyRain.Plugins.ScoreBoard.ScoreBoardPlugin(_game),
        new FunnyRain.Plugins.Blocks.BlocksPlugin(_game),
        new FunnyRain.Plugins.FallingThings.FallingThingsPlugin(_game),
      ];
      return result;
    }

    function forEachPlugin (isForward, fn) {
      var len = _pluginList.length;
      var index = isForward ? 0 : len - 1;
      var result = null;
      while (!result && (index > -1 && index < len)) {
        result = fn(_pluginList[index]);
        index = isForward ? index + 1 : index - 1;
      }
      return result;
    }

    function load () {
      forEachPlugin(true, function (plugin) {
        if (plugin.load) {
          plugin.load();
        }
      });
    }

    function step () {
      forEachPlugin(true, function (plugin) {
        if (plugin.step) {
          plugin.step();
        }
      });
    }

    function enable (isEnabled) {
      forEachPlugin(isEnabled, function (plugin) {
        if (plugin.enable) {
          plugin.enable(isEnabled);
        }
      });
    }

    function findPlugin (id) {
      var found = forEachPlugin(false, function (plugin) {
        if (id === plugin.getPluginId()) {
          return plugin;
        }
      });
      return found;
    }

    PluginManager.prototype.load = function () {
      load.call(this);
    };

    PluginManager.prototype.step = function () {
      step.call(this);
    };

    PluginManager.prototype.enable = function (isEnabled) {
      enable.call(this, isEnabled);
    };

    PluginManager.prototype.findPlugin = function (id) {
      return findPlugin.call(this, id);
    };
  }

  FunnyRain.Plugins.PluginManager = PluginManager;

})(FunnyRain);
