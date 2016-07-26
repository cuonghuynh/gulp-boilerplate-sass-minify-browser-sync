## Install Gulp

You need to have Node.js (Node) installed onto your computer before you can install Gulp. 
You can install Gulp by using the following command in the command line:

```sh
$ npm install -g gulp
```

## Folder Structure

We will use the structure of a generic webapp:

```sh
  |- app/
      |- css/
      |- fonts/
      |- images/ 
      |- index.html
      |- js/ 
      |- scss/
  |- public/
      |- css/
      |- fonts/
      |- images/ 
      |- index.html
      |- js/ 
  |- gulpfile.js
  |- node_modules/ **vendors for gulp
  |- bower_components/ **vendors for dev
  |- package.json
```

## Gulp Tasks
Defines config variables
```sh
var config = {
    devPath: './app/',
    publicPath: './public/',
    sassDir: 'sass/',
    jsDir: 'js/',
    cssDir: 'css/',
    fontDir: 'fonts/',
    moduleDir: './node_modules',
}
```
### 1. Browser sync

Requires the gulp-sass plugin
```sh
var browserSync = require('browser-sync').create();
```
Defines task
```sh
gulp.task('browserSync', function() {
    var htmlDir = config.publicPath;

    browserSync.init({
        server: {
            baseDir: htmlDir
        },
    })
})
```
### 2. Sass

Requires the gulp-sass plugin
```sh
var sass = require('gulp-sass');
var notify = require("gulp-notify");
```
Defines task
```sh
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
```
### 3. Export JS
Defines task
```sh
gulp.task('js', function() {
    var jsFiles = config.devPath + config.jsDir + '**/*.js';    // All files
    var destDir = config.publicPath + config.jsDir;

    return gulp.src(jsFiles)
                .pipe(gulp.dest(destDir));
});
```
### 4. Export Fonts

Defines task
```sh
gulp.task('fonts', function() {
    var fontFiles = config.devPath + config.fontDir + '**/*';   // All files
    var destDir = config.publicPath + config.fontDir;

    return gulp.src(fontFiles)
                .pipe(gulp.dest(destDir));
});
```
### 5. Optimizing CSS and Javascript files
Developers have two tasks to perform when we try to optimize CSS and JavaScript files for production: minification and concatenation.

we have included 3 script tags in `app/index.html`.

```sh
<head>
  <link rel="stylesheet" href="../public/css/styles.css">
  <link rel="stylesheet" href="../bower-components/another-stylesheet.css">
</head>
<body>
  <!-- other stuff -->
  <script src="../bower-components/a-library.js"></script>
  <script src="../bower-components/another-library.js"></script>
  <script src="../public/js/main.js"></script>
</body>
```
We'll want the final CSS and JavaScript file to be generated in the `js` folder, as `public/js/main.min.js` and `css` folder as `public/css/styles.min.css`. Hence, the markup would be:
```sh
<head>
  <!--build:css css/styles.min.css-->
  <link rel="stylesheet" href="../public/css/styles.css">
  <link rel="stylesheet" href="../bower-components/another-stylesheet.css">
  <!--endbuild-->
</head>
<body>
  <!--build:js js/main.min.js -->
  <script src="../public/js/bower-components/a-library.js"></script>
  <script src="../public/js/bower-components/another-library.js"></script>
  <script src="../public/js/main.js"></script>
  <!--endbuild-->
</body>
```
Requires the gulp-sass plugin
```sh
var notify = require("gulp-notify");
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
```
Defines task
```sh
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
```
### Watch tasks
```sh
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
```
`Gulp-useref` is that it automatically changes all the scripts within "<!--build:" and "<!--endbuild-->" into one single file that points to `<!--build:js [path] -->`.
```sh
<head>
  <link rel="stylesheet" href="css/styles.min.css">
</head>
<body>
  <script src="js/main.min.js"></script>
</body>
```
## Usage
Run `gulp watch`
