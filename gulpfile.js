'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var mainBowerFiles = require('main-bower-files');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var ghPages = require('gulp-gh-pages');
var del = require('del');

// Copy bower assets to build/lib
gulp.task('bower', function moveBowerDeps() {
  return gulp.src(mainBowerFiles(), { base: 'bower_components' })
      .pipe(gulp.dest('build/lib'));
});

// Merge custom scss into bootstrap
gulp.task('bootstrap:customize', ['bower'], function() {
  // gulp.src('sass/bootstrap/*.scss')
  //   .pipe(gulp.dest('build/lib/bootstrap/scss/'));
  return gulp.src('sass/*.scss')
    .pipe(gulp.dest('build/lib/bootstrap/scss/'));
});

gulp.task('bootstrap:js', ['bootstrap:customize'], function() {
  return   gulp.src('build/lib/bootstrap/dist/js/*')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('jquery', ['bootstrap:customize'], function() {
  return   gulp.src('build/lib/jquery/dist/*')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function() {
  return   gulp.src('html/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('cssimg', ['bootstrap:customize'], function() {
  return   gulp.src('sass/img/*')
    .pipe(gulp.dest('dist/css/img'));
});

gulp.task('sass', ['bootstrap:customize'], function() {
  return gulp.src('build/lib/bootstrap/scss/bootstrap.scss')
	.pipe(sass.sync({precision:8}).on('error', sass.logError))
	.pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('dist', ['bootstrap:js','jquery','html','sass', 'cssimg'], function() {
});

gulp.task('default', ['dist'], function() {
});

gulp.task('clean', function () {
  return del.sync(['dist/*', '!dist/.git'], {dot: true});
});

gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('html/*.html', ['html']);
});

/* ============
 *
 *	Publish to
 *		https://italia-it.github.io/ita-bootstrap
 */
gulp.task('deploy', ['dist'], function () {
  return gulp.src(['./dist/**/*'])
    .pipe(ghPages());
});
