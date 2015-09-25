var requireDir  = require('require-dir');

global.boplexGulp = {};
global.boplexGulp.config = {
  libName: "boplex",
  tstName: "test",
  dstDir: "./bin",
  srcDir: "./src",
  tstDir: "./test",
  appDir: "./test/app",
};

global.boplexGulp.config.libFiles =  [
    boplexGulp.config.srcDir + "/boplex.boplex.js",
    boplexGulp.config.srcDir + "/boplex.baseObject.js",
    boplexGulp.config.srcDir + "/boplex.logger.js",
    boplexGulp.config.srcDir + "/boplex.event.js",
];

global.boplexGulp.config.appFiles = [
    boplexGulp.config.appDir + "/boplexTest.boplexTest.js",
    boplexGulp.config.appDir + "/boplexTest.point.js",
];

requireDir('./gulp', { recurse: true });
