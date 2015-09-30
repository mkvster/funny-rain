(function(FunnyRain){
  "use strict";

  function ExplosionClip () {

    var _frameCount = 26;
    var _explosionTextures = [];

    init();

    function init () {
      onAssetsLoaded();
    }

    function onAssetsLoaded () {
      // create an array to store the textures
      for (var i = 0; i < _frameCount; i++) {
        var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " +
          (i+1) + ".png");
        _explosionTextures.push(texture);
      }
    }

    function createExplosion (pos) {
      var result = new PIXI.Container();

      // create an explosion MovieClip
      var explosion = new PIXI.extras.MovieClip(_explosionTextures);

      explosion.position.x = pos.x;
      explosion.position.y = pos.y;
      explosion.anchor.x = 0.5;
      explosion.anchor.y = 0.5;

      explosion.rotation = Math.random() * Math.PI;

      explosion.scale.set(0.75 + Math.random() * 0.5);

      explosion.gotoAndPlay(Math.random() * 27);

      result.addChild(explosion);
      return result;
    }

    ExplosionClip.prototype.createExplosion = function (pos) {
      return createExplosion.call(this, pos);
    };
  }

  FunnyRain.Graphics.Widgets.ExplosionClip = ExplosionClip;

})(FunnyRain);
