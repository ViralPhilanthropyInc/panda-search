// https://gist.github.com/Sigmus/9253068
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var notify = require("gulp-notify");
var childProcess = require('child_process');
var scss = require('gulp-scss');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var staticServer = require('./static-server');

var buildDir = './dist';

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildJS(watch) {
    if(watch) {
        gulp.watch('js/**/*.js*', ['buildJS']);
    }

    // TODO make these vendor entries dynamic
    return browserify({
        entries: [
            'js/app.js'
        ],
        cache: {},
        packageCache: {},
        fullPaths: true,
        transform: [reactify],
        extensions: [".js", ".jsx"]
    })
        .bundle()
        .on('error', handleErrors)
        .pipe(source('js/app.js'))
        .pipe(gulp.dest(buildDir + '/'));
}

function buildCSS(watch) {
    if(watch) {
        gulp.watch('css/**/*.*css', ['buildCSS']);
    }

    var theme = gulp.src([
        'theme/bootstrap.css',
        'theme/theme.css'
    ]);

    var ours =
        gulp.src('css/**/*.*css')
        .pipe(scss())
        .on('error', handleErrors);

    return merge(theme, ours)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(buildDir + '/css/'));
};

gulp.task('buildJS', function() {
    return buildJS('app.js', false);
});

gulp.task('buildCSS', function() {
    return buildCSS(false);
});

gulp.task('copyFonts', function() {
    return gulp
        .src('theme/bootstrap/fonts/*')
        .pipe(gulp.dest(buildDir + '/fonts'));
});

gulp.task('staticServer', function() {
    staticServer.init();
});

gulp.task('default', ['buildJS', 'buildCSS', 'copyFonts', 'staticServer'], function() {
    return merge(
        buildJS(true),
        buildCSS(true)
    );
});

var home = require('homedir')();
var rubberSecret = require('yamljs')
    .load(
        home + '/.rubber-panda-server-production/rubber-secret.yml'
    );

var aws = {
    accessKeyId: rubberSecret.cloud_providers.aws.access_key,
    secretAccessKey: rubberSecret.cloud_providers.aws.secret_access_key
};

var s3 = require('gulp-s3-upload')(aws);

gulp.task('upload', function() {
    return gulp
        .src(['./dist/js/*', './dist/css/*', 'index.html'])
        .pipe(s3({ Bucket: 'panda-search', ACL: 'public-read' }));
});

gulp.task('release', ['buildJS', 'buildCSS', 'upload'], function() { });

