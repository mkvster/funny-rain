(function(FunnyRain){
  "use strict";

  function BlocksFactory (options) {

    var _blockClassList = [
      {
        blockCategory: "fruit",
        blockClass: FunnyRain.Plugins.Blocks.FruitBlock,
        blockTypes: ["apple","peach","orange"]
      },
      {
        blockCategory: "bomb",
        blockClass: FunnyRain.Plugins.Blocks.BombBlock,
        blockTypes: ["bomb"]
      }
    ];

    var _defaults = {

    };
    var _settings = $.extend( {}, _defaults, options );
    var _nextId;
    var _blockList = [];

    init();
    function init () {
      _nextId = 0;
    }


    function findBlockCategory (blockCategory) {
      for(var i = 0; i < _blockClassList.length; i++) {
        var blockClassRecord = _blockClassList[i];
        if(blockClassRecord.blockCategory === blockCategory) {
          return blockClassRecord;
        }
      }
      return null;
    }


    function createRandomBlock (blockCategoryRecord) {
      var blockTypeIndex = Boplex.random(0,
        blockCategoryRecord.blockTypes.length-1);

      var blockId = ++_nextId;

      var block = new blockCategoryRecord.blockClass(blockId,
        blockCategoryRecord.blockTypes[blockTypeIndex],
        blockCategoryRecord.blockCategory);

      _blockList.push(block);
      return block;

    }

    function createBlockByCategory (blockCategory) {
      var blockCategoryRecord = findBlockCategory(blockCategory);
      if (!blockCategoryRecord) {
        throw new RangeError(blockCategory + " - unknown block category");
      }
      return createRandomBlock(blockCategoryRecord);
    }

    function destroyBlock (block) {
      for(var i = 0; i < _blockList.length; i++){
        if (block === _blockList[i]) {
          _blockList.splice(i,1);
          break;
        }
      }
    }

    BlocksFactory.prototype.createBlockByCategory = function (blockCategory) {
      return createBlockByCategory.call(this, blockCategory);
    };

    BlocksFactory.prototype.forEach = function (handler) {
      _blockList.forEach(handler);
    };

    BlocksFactory.prototype.destroyBlock = function (block) {
      destroyBlock.call(this, block);
    };
  }

  FunnyRain.Plugins.Blocks.BlocksFactory = BlocksFactory;

})(FunnyRain);
