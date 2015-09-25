var gulp = require("gulp");
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var util = require("gulp-util");

gulp.task("lint", function(){
  util.log(util.colors.blue("Analizing dev with gulp"));
  return gulp
    .src([
      boplexGulp.config.dstDir + "/" + boplexGulp.config.libName + ".js"
    ])
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish", {verbose: true}));
});
