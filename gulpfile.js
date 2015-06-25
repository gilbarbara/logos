var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    browserSync = require('browser-sync');

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

gulp.task('bundle', function () {
    var assets = $.useref.assets();

    return gulp.src('assets/*.html')
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

gulp.task('serve', ['clean', 'styles'], function () {
    browserSync({
        notify: false,
        logPrefix: 'logos',
        files: ['assets/*.html', '.tmp/*.css', 'logos'],
        server: {
            baseDir: ['./', '.tmp', 'assets']
        }
    });

    gulp.watch('styles/**/*.scss', function (e) {
        if (e.type === 'changed') {
            gulp.start('styles');
        }
    });
});

gulp.task('deploy', ['styles', 'bundle'], function () {
    return gulp.src(['logos/*.svg', '.tmp/*.html', '.tmp/main.css', '*.md'])
        .pipe($.ghPages({
            force: true
        }));
});

gulp.task('default', ['serve']);
