var gulp = require('gulp'),
    ssg = require('gulp-ssg'),
    frontmatter = require('gulp-front-matter'),
    marked = require('gulp-marked'),
    fs = require('fs'),
    es = require('event-stream'),
    mustache = require('mustache'),
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
      file.contents = Buffer.from(html);
      cb(null, file);
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('less', function() {
  return gulp.src('src/less/main.less')
    .pipe(less())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/css'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('src/less/*.less', ['less']);
});

// SVG to PNG
gulp.task('raster', function () {
    return gulp.src('src/static/img/*.svg')
        .pipe(raster())
        .pipe(rename({extname: '.png'}))
        .pipe(gulp.dest('dist/img/'));
});

// Copy static resources
gulp.task('static', function () {
    return gulp.src('src/static/**/*', {encoding: false})
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', gulp.series('raster', 'static', 'html', 'less'));

