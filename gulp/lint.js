var gulp = require("gulp");
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var util = require("gulp-util");

gulp.task("lint", function(){
  var fileName = solution.funnyRain.dstDir +
    "/" + solution.funnyRain.project.name + ".js"
  util.log(util.colors.blue("Linting " + fileName));
  return gulp
    .src([fileName])
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish", {verbose: true}));
});
