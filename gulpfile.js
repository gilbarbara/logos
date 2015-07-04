var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    del         = require('del'),
    runSequence = require('run-sequence');

gulp.task('styles', function () {
    return gulp.src('assets/styles/main.scss')
        .pipe($.plumber())
        .pipe($.sass.sync({
            precision: 4
        }).on('error', $.sass.logError))
        .pipe($.plumber.stop())
        .pipe($.autoprefixer({
            browsers: ['last 4 versions']
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('templates', function () {
    return gulp.src('assets/templates/index.handlebars')
        .pipe($.compileHandlebars())
        .pipe($.rename('index.html'))
        .pipe($.debug())
        .pipe(gulp.dest('.tmp'));
});

gulp.task('copy', function () {
    return gulp.src('assets/media/**/*')
        .pipe(gulp.dest('.tmp'));
});

gulp.task('bundle', function () {
    var assets = $.useref.assets();

    return gulp.src('.tmp/*.html')
        .pipe(assets)
        .pipe($.if('*.css', $.cssmin()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.replace('../logos/', ''))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('clean', function (cb) {
    del(['.tmp/*'], cb);
});

gulp.task('serve', ['clean', 'templates', 'copy', 'styles'], function () {
    browserSync({
        notify: false,
        logPrefix: 'logos',
        files: ['assets/*.html', '.tmp/*.css', 'logos'],
        server: {
            baseDir: ['./', '.tmp', 'assets']
        }
    });

    gulp.watch('assets/styles/**/*.scss', function (e) {
        if (e.type === 'changed') {
            gulp.start('styles');
        }
    });
});

gulp.task('build', function (cb) {
    runSequence('templates', 'bundle', 'styles', cb);
});


gulp.task('deploy', ['build'], function () {
    return gulp.src(['logos/*.svg', '.tmp/*.html', '.tmp/main.css', 'assets/media/**/*', 'assets/CNAME', '*.md'])
        .pipe($.ghPages({
            force: true
        }));

});

gulp.task('default', ['serve']);
