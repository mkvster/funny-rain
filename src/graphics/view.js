(function (FunnyRain) {
  "use strict";

  function View (options) {

    var _logger = new Boplex.Logger("FunnyRain.Graphics.View");
    var _defaults = {
      canvasSize: {x:1600,y:1200},
      backgroundColor: 0x1099bb,
      assetsDir: "assets/",
      backgroundImage: "background",
    };
    var _settings = $.extend( {}, _defaults, options );
    var _renderer;
    var _scene;
    var _dialog;

    init();

    function getPngUrl (name) {
      var result = _settings.assetsDir + name + ".png";
      return result;
    }

    function init () {
      _renderer = PIXI.autoDetectRenderer(
        _settings.canvasSize.x,
        _settings.canvasSize.y,
        {backgroundColor : _settings.backgroundColor});

      _scene = createContainer(_settings.backgroundImage);

      initDialog();
    }

    function initDialog () {

    }

    function createSprite (imageId) {
      var url = getPngUrl(imageId);
      var sprite = new PIXI.Sprite.fromImage(url);
      return sprite;
    }

    function createContainer (imageId) {
      var sprite = createSprite(imageId);
      var result = new PIXI.Container();
      result.addChild(sprite);
      result.sprite = sprite;
      return result;
    }

    function createActor (imageId) {
      var result = createContainer(imageId);
      _scene.addChild(result);
      return result;
    }

    function destroyActor (actor) {
      if (!actor) {
        return;
      }
      var parent = actor.parent;
      if (parent) {
        parent.removeChild(actor);
      }
    }

    function getSprite (actor) {
      return actor.sprite;
    }

    function getView () {
      return _renderer.view;
    }

    function setScale (scale, w, h) {
      _scene.scale.x = _scene.scale.y = scale;
      _renderer.resize(w,h);
    }

    function getScale () {
      return _scene.scale.x;
    }

    function step () {
      _renderer.render(_scene);
    }

    function createWidget (widget) {
      _scene.addChild(widget);
      return widget;      
    }

    function destroyWidget (widget) {
      destroyActor(widget);
    }

    View.prototype.step = function () {
      step.call(this);
    };

    View.prototype.setScale = function (scale, w, h) {
      setScale.call(this, scale, w, h);
    };

    View.prototype.getView = function () {
      return getView.call(this);
    };

    View.prototype.createActor = function (imageId) {
      return createActor.call(this, imageId);
    };

    View.prototype.destroyActor = function (actor) {
      return destroyActor.call(this, actor);
    };

    View.prototype.createWidget = function (widget) {
      return createWidget.call(this, widget);
    };

    View.prototype.destroyWidget = function (widget) {
      return destroyWidget.call(this, widget);
    };
  }

  FunnyRain.Graphics.View = View;

})(FunnyRain);
