var gulp = require("gulp");
var util = require("gulp-util");
var gulpprint = require("gulp-print");
var gulpconcat = require("gulp-concat");
var uglify = require("gulp-uglify");
var dest = require("gulp-dest");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var runSeq  = require("run-sequence");

function buildApp (app, isMin, fileList, isTest) {
  isMin = isMin || false;
  fileList = fileList || app.project.files;
  srcDir = app.srcDir;
  dstDir = app.dstDir;
  dstName = app.project.name;

  var suffix = isMin ? ".min" : "";
  var dstFileName = dstName + suffix + ".js";
  var s1 = gulp
    .src(fileList)
    .pipe(gulpprint())
    .pipe(gulpconcat(dstFileName));

  var s2;
  if (isMin) {
    s2 = s1.pipe(uglify());
  }
  else if (isTest) {
    s2 = s1
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish", {verbose: true}));
  }
  else {
    s2 = s1
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish", {verbose: true}));
  }

  return s2
    .pipe(gulp.dest(dstDir));

}

gulp.task("build-bin", function(done) {
  util.log(util.colors.blue("Build bin"));
  return buildApp(solution.funnyRain, true);
});

gulp.task("build-dev", function(done){
  util.log(util.colors.blue("Build dev"));
  return buildApp(solution.funnyRain, false);
});

gulp.task("build-test-dev", function(done){
  util.log(util.colors.blue("Build test dev"));
  var fileList = solution.test.project.dependencies
    .concat(solution.funnyRain.project.files)
    .concat(solution.test.project.files);
  return buildApp(solution.test, false, fileList, true);
});

gulp.task("build-test-bin", function(done){
  util.log(util.colors.blue("Build test bin"));
  var fileList = solution.test.project.dependencies
    .concat(solution.funnyRain.project.files)
    .concat(solution.test.project.files);
  return buildApp(solution.test, true, fileList, true);
});

gulp.task("build", function (done) {
  runSeq("build-dev", "build-bin", "build-test-dev", "build-test-bin", done);
});
