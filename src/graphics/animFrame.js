(function (FunnyRain) {
  "use strict";

  function AnimFrame (onScale, onStep, options) {

    var _onScale = onScale;
    var _onStep = onStep;
    var _logger = new Boplex.Logger("FunnyRain.AnimFrame");
    var _defaults = {
      canvasSize: {x:1600,y:1200},
      dpr: window.devicePixelRatio,
    };

    var _settings = $.extend( {}, _defaults, options );

    (function () {
      animate();
      $(window).on("resize deviceOrientation", onResized);
      $(window).trigger("resize");
    })();

    function onResized () {
      var w = $(window).innerWidth();
      var h = $(window).innerHeight();
      resize(w, h);
    }

    window.requestAnimFrame = (function() {
      return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    function animate () {
      requestAnimationFrame(animate);
      _onStep();
    }

    function resize (width, height) {
      var targetScale = 1;

      var cv = _settings.canvasSize;
      var scale_x = width/cv.x;
      var scale_y = height/cv.y;

      if(scale_x > 1 || scale_y > 1) {
        targetScale = 1;
      }else{
        if(scale_y > scale_x){
          targetScale = scale_x;
        }else{
          targetScale = scale_y;
        }
      }

      var w = targetScale * cv.x;
      var h = targetScale * cv.y;

      _onScale(targetScale, w, h);
    }

  }

  FunnyRain.Graphics.AnimFrame = AnimFrame;

})(FunnyRain);
