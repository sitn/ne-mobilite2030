var gulp = require('gulp'),
    ssg = require('gulp-ssg'),
    frontmatter = require('gulp-front-matter'),
    marked = require('gulp-marked'),
    fs = require('fs'),
    es = require('event-stream'),
    mustache = require('mustache'),
    http = require('http'),
    ecstatic = require('ecstatic'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    raster = require('gulp-raster'),
    rename = require('gulp-rename');

var site = {
  title: 'NE Mobilité 2030'
};

gulp.task('html', function() {
  var template = String(fs.readFileSync('src/templates/template.html'));

  return gulp.src('src/pages/**/*.html')
    .pipe(frontmatter({
      property: 'meta'
    }))
    .pipe(marked())
    .pipe(ssg(site, {
      property: 'meta'
    }))
    .pipe(es.map(function(file, cb) {
      var html = mustache.render(template, {
        page: file.meta,
        site: site,
        content: String(file.contents)
      });
      file.contents = new Buffer(html);
      cb(null, file);
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('less', function() {
  return gulp.src('src/less/main.less')
    .pipe(less())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //.pipe(concat('styles.css'))
    //.pipe(gulp.dest('themes/vitrocsa/css'))
    //.pipe(rename({suffix: '.min'}))
    
    //.pipe(minifycss())
    //.pipe(concat('styles.min.css'))
    //.pipe(gulp.dest('themes/vitrocsa/css'))
    //.pipe(notify({ message: 'Styles task complete' }));

    .pipe(gulp.dest('dist/css'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('src/less/main.less', ['default']);
});

// SVG to PNG
gulp.task('raster', function () {
    gulp.src('src/static/img/*.svg')
        .pipe(raster())
        .pipe(rename({extname: '.png'}))
        .pipe(gulp.dest('dist/img/'));
});

// Copy static resources
gulp.task('static', function () {
    gulp.src('src/static/**/*')
        .pipe(gulp.dest('dist/'));
});

/*gulp.task('watch', function() {
  http.createServer(
    ecstatic({root: __dirname + '/dist/home'})
  ).listen(4000);
  console.log("Preview at http://localhost:4000");

  gulp.watch('src/*.markdown', ['html']);
  gulp.watch('templates/*.html', ['html']);
});*/

gulp.task('build', ['raster', 'static', 'html', 'less']);


