'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require("gulp-notify");
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

/*----------  Config settings  ----------*/

var config = {
	devPath: './app/',
	publicPath: './public/',
	sassDir: 'sass/',
	jsDir: 'js/',
	cssDir: 'css/',
	fontDir: 'fonts/',
	moduleDir: './node_modules',
}

/*----------  Define tasks  ----------*/

gulp.task('browserSync', function() {
	var htmlDir = config.publicPath;

	browserSync.init({
	    server: {
	      	baseDir: htmlDir
	    },
	})
})

gulp.task('sassTask', function () {
	var sassFiles = config.devPath + config.sassDir + '/*.scss';
	var destDir = config.publicPath + config.cssDir;

	return gulp.src(sassFiles)
		.pipe(sass()
			.on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
		.pipe(gulp.dest(destDir));
});

gulp.task('useref', function(){
	var htmlFiles = config.devPath + '*.html';
	var destDir = config.publicPath;

  	return gulp.src(htmlFiles)
	    .pipe(useref())
	    // Minifies only if it's a JavaScript file
    	.pipe(gulpIf('*.js', uglify()))
    	// Minifies only if it's a CSS file
    	.pipe(gulpIf('*.css', cssnano()))
	    .pipe(gulp.dest(destDir))
	    .pipe(browserSync.reload({
	      	stream: true
	    }));
});

gulp.task('js', function() {
	var jsFiles = config.devPath + config.jsDir + '**/*.js';	// All files
	var destDir = config.publicPath + config.jsDir;

  	return gulp.src(jsFiles)
  				.pipe(gulp.dest(destDir));
});

gulp.task('fonts', function() {
	var fontFiles = config.devPath + config.fontDir + '**/*';	// All files
	var destDir = config.publicPath + config.fontDir;

  	return gulp.src(fontFiles)
  				.pipe(gulp.dest(destDir));
});

/*----------  Define watch  ----------*/

gulp.task('watch', ['browserSync', 'sassTask', 'js', 'useref', 'fonts'], function () {
	var sassFiles = config.devPath + config.sassDir + '**/*.scss';
	var jsFiles = config.devPath + config.jsDir + '**/*.js';
	var htmlFiles = config.devPath + '*.html';
	var fontFiles = config.devPath + config.fontDir + '**/*';

  	gulp.watch(sassFiles, ['sassTask', 'useref']);
  	gulp.watch(jsFiles, ['js', 'useref']);
  	gulp.watch(htmlFiles, ['useref']);
  	gulp.watch(fontFiles, ['fonts']);
});

gulp.task('default', ['browserSync', 'sassTask', 'useref', 'fonts']);