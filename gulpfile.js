var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    raster = require('gulp-raster'),
    rename = require('gulp-rename')/*,
    svg2png = require('gulp-svg2png'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del')*/;

gulp.task('default', function() {
  return gulp.src('front-end/css/main.less')
    .pipe(less())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //.pipe(concat('styles.css'))
    //.pipe(gulp.dest('themes/vitrocsa/css'))
    //.pipe(rename({suffix: '.min'}))
    
    //.pipe(minifycss())
    //.pipe(concat('styles.min.css'))
    //.pipe(gulp.dest('themes/vitrocsa/css'))
    //.pipe(notify({ message: 'Styles task complete' }));

    .pipe(gulp.dest('front-end/css'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('front-end/css/main.less', ['default']);
});

gulp.task('raster', function () {
    gulp.src('front-end/img/*.svg')
        .pipe(raster())
        .pipe(rename({extname: '.png'}))
        .pipe(gulp.dest('front-end/img/'));
});