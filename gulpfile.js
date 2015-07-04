var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    del         = require('del'),
    fs          = require('fs'),
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
    var json         = JSON.parse(fs.readFileSync('./assets/logos.json')),
        templateData = {
            items: []
        },
        meta         = [];

    json.items.forEach(function (d) {
        meta.push(d.name);

        d.files.forEach(function (f) {
            templateData.items.push({
                name: d.name,
                shortname: d.shortname,
                url: d.url,
                image: f
            });
        });
    });
    templateData.meta = meta.join(', ');

    return gulp.src('assets/templates/index.handlebars')
        .pipe($.compileHandlebars(templateData, {
            batch: ['./assets/templates']
        }))
        .pipe($.rename('index.html'))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('readme', function () {
    var json = JSON.parse(fs.readFileSync('./assets/logos.json'));

    return gulp.src('assets/templates/README.handlebars')
        .pipe($.compileHandlebars(json.items, {
            batch: ['./assets/templates']
        }))
        .pipe($.rename('README.md'))
        .pipe(gulp.dest('./'));
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
        .pipe($.if('*.js', $.uglify()))
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
        files: ['.tmp/*.html', '.tmp/*.css', 'logos', 'assets/scripts/*.js'],
        server: {
            baseDir: ['./', '.tmp', 'assets']
        }
    });

    gulp.watch('assets/styles/**/*.scss', function (e) {
        if (e.type === 'changed') {
            gulp.start('styles');
        }
    });
    gulp.watch(['assets/templates/**/*', 'assets/logos.json'], ['templates']);
});

gulp.task('build', function (cb) {
    runSequence('readme', 'templates', 'bundle', 'styles', cb);
});


gulp.task('deploy', ['build'], function () {
    return gulp.src([
        'logos/*.svg',
        '.tmp/*.html',
        '.tmp/main.css',
        '.tmp/main.js',
        'assets/media/**/*',
        'assets/CNAME',
        '*.md'
    ])
        .pipe($.ghPages({
            force: true
        }));

});

gulp.task('default', ['serve']);
