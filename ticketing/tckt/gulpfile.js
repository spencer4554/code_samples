'use strict';

var
    gulp = require('gulp')
  , browserify = require('browserify')
  , reactify = require('reactify')
  , ifElse = require('gulp-if-else')
  , minifyCSS = require('gulp-minify-css')
  , source = require('vinyl-source-stream')
  , shell = require('gulp-shell')
  , sass = require('gulp-sass')
  , uglify = require('gulp-uglify')
  , streamify = require('gulp-streamify')
  , envify = require('envify')
  , production = false
;

if (process.env.PRODUCTION) {
    production = true
}

gulp.task('js', function() {
    var onError = function(err) {
            console.log(err);
            this.end();
        };

    browserify({
        entries: ['./entry.js'],
        basedir: './assets/src/js'
    }).transform(envify).transform(reactify)
        .require('./entry', {expose: 'eventRender'})
        .require('underscore')
        .bundle()
        .on('error', onError)
        .pipe(source('tckt.js'))
        .pipe(ifElse(production, function() { return streamify(uglify()) }))
        .pipe(gulp.dest('./assets/compiled/'));
});

gulp.task('sass', function() {
    return gulp.src('./assets/src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/compiled/'));
});

gulp.task('watch_js', function() {
    gulp.watch('./assets/src/js/**/*.js', ['js']);
});

gulp.task('watch_sass', function() {
    gulp.watch('./assets/src/sass/**/*.scss', ['sass']);
});

gulp.task('server', shell.task("./manage.py runserver"));

gulp.task('default', ['watch_js', 'watch_sass', 'server']);
