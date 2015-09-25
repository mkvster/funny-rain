var requireDir  = require('require-dir');
var util = require("gulp-util");
var fs = require('fs');

global.solution = JSON.parse(fs.readFileSync('./solution.json'));
loadApp(solution.funnyRain);
loadApp(solution.test);

function loadApp(app){
  var projectFile = app.project;
  util.log(util.colors.blue("Loading " + projectFile));
  app.project = JSON.parse(fs.readFileSync(projectFile));
  for(var i = 0; i < app.project.files.length; i++) {
    app.project.files[i] = app.srcDir + "/" + app.project.files[i];
  }
}

requireDir('./gulp', { recurse: true });
