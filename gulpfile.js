var gulp               = require('gulp'),
    $                  = require('gulp-load-plugins')(),
    browserify         = require('browserify'),
    buffer             = require('vinyl-buffer'),
    browserSync        = require('browser-sync').create(),
    del                = require('del'),
    exec               = require('child_process').exec,
    fs                 = require('fs'),
    historyApiFallback = require('connect-history-api-fallback'),
    merge              = require('merge-stream'),
    path               = require('path'),
    runSequence        = require('run-sequence'),
    source             = require('vinyl-source-stream'),
    vinylPaths         = require('vinyl-paths'),
    watchify           = require('watchify');

var isProduction = function () {
        return process.env.NODE_ENV === 'production';
    },
    target       = function () {
        return (isProduction() ? 'dist' : '.tmp');
    },
    middleware   = historyApiFallback({}),
    commitMessage;

function watchifyTask (options) {
    var bundler, rebundle, iteration = 0;
    bundler = browserify({
        entries: path.join(__dirname, '/app/scripts/main.js'),
        insertGlobals: true,
        cache: {},
        //debug: options.watch,
        packageCache: {},
        fullPaths: options.watch, //options.watch
        extensions: ['.jsx'],
        transform: [
            ['babelify', { ignore: /bower_components/ }]
        ]
    });

    if (options.watch) {
        bundler = watchify(bundler);
    }

    rebundle = function () {
        var stream = bundler.bundle();

        if (options.watch) {
            stream.on('error', function (err) {
                console.log(err);
            });
        }

        stream
            .pipe(source($.if(options.watch, 'app.js', 'app.min.js')))
            .pipe(buffer())
            .pipe($.if(!options.watch, $.uglify()))
            .pipe(gulp.dest(target() + '/assets'))
            .pipe($.tap(function () {
                if (iteration === 0 && options.cb) {
                    options.cb();
                }
                iteration++;
            }));
    };

    bundler.on('update', rebundle);
    return rebundle();
}

// Scripts
gulp.task('scripts', function (cb) {
    return watchifyTask({
        watch: !isProduction(),
        cb: cb
    });
});

gulp.task('lint', function () {
    return gulp.src('app/scripts/**/*')
        .pipe($.eslint({
            useEslintrc: true
        }))
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError());
});

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.plumber())
        .pipe($.sass.sync({
            precision: 4
        }).on('error', $.sass.logError))
        .pipe($.plumber.stop())
        .pipe($.autoprefixer({
            browsers: ['last 4 versions']
        }))
        .pipe(gulp.dest('.tmp/assets'))
        .pipe(browserSync.stream());
});

gulp.task('media', function () {
    return gulp.src(['**/*.{jpg,gif,png}'], { cwd: 'app/media/' })
        .pipe($.imagemin({
            verbose: true
        }, {
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/media'))
        .pipe($.size({
            title: 'Media'
        }));
});

gulp.task('icons', function () {
    gulp.src('**/*.svg', { cwd: 'app/media/icons' })
        .pipe($.svgSprite({
            mode: {
                symbol: {
                    dest: '.',
                    prefix: '',
                    sprite: 'icons'
                }
            }
        }))
        .pipe($.replace(/ fill=".*?"/g, ''))
        .pipe(gulp.dest('app/media'));
});

gulp.task('readme', function () {
    var json = JSON.parse(fs.readFileSync('./app/logos.json'));

    return gulp.src('app/templates/README.handlebars')
        .pipe($.compileHandlebars(json.items, {
            batch: ['./app/templates']
        }))
        .pipe($.rename('README.md'))
        .pipe(gulp.dest('./'));
});

gulp.task('copy', function () {
    return gulp.src('app/media/**/*')
        .pipe(gulp.dest('.tmp'));
});

gulp.task('bundle', function () {
    var html,
        vendor,
        extras,
        media,
        logos,
        assets = $.useref.assets();

    html = gulp.src('app/*.html')
        .pipe(assets)
        .pipe($.if('*.css', $.cssmin()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'HTML'
        }));

    vendor = gulp.src('bower_components/modernizr/modernizr.js')
        .pipe($.uglify())
        .pipe($.rename('modernizr.min.js'))
        .pipe(gulp.dest('dist/assets'))
        .pipe($.size({
            title: 'Vendor'
        }));

    extras = gulp.src([
        'app/files/CNAME',
        'app/favicon.ico'
    ])
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'Extras'
        }));

    media = gulp.src([
        'app/media/*.svg'
    ])
        .pipe(gulp.dest('dist/media'))
        .pipe($.size({
            title: 'Media'
        }));

    logos = gulp.src([
        'logos/*.svg'
    ])
        .pipe(gulp.dest('dist/logos'))
        .pipe($.size({
            title: 'Logos'
        }));

    return merge(html, vendor, extras, media, logos);
});

gulp.task('sizer', function () {
    return gulp.src(target() + '/**/*')
        .pipe($.size({
            title: 'Build',
            gzip: true
        }));
});

gulp.task('assets', function (cb) {
    runSequence('styles', 'scripts', cb); //, 'fonts'
});

gulp.task('clean', function (cb) {
    del([target() + '/*'], cb);
});

gulp.task('get-commit', function (cb) {
    exec('git log -1 --pretty=%s && git log -1 --pretty=%b', function (err, stdout, stderr) {
        var parts = stdout.replace('\n\n', '').split('\n');

        commitMessage = parts[0];
        if (parts[1]) {
            commitMessage += ' — ' + parts[1];
        }

        cb(err);
    });
});

gulp.task('gh-pages', function () {
    var clean,
        push;

    clean = gulp.src('.publish/.DS_Store')
        .pipe(vinylPaths(del));

    push = gulp.src(['dist/!**!/!*'], {
        dot: true
    })
        .pipe($.ghPages({
            force: true,
            message: commitMessage
        }));

    return merge(clean, push);
});

gulp.task('gh-master', function () {

    var clean,
        push;

    clean = gulp.src('.master/.DS_Store')
        .pipe(vinylPaths(del));

    push = gulp.src([
        'logos/!**!/!*.svg',
        'README.md',
        'LICENSE.txt'
    ], { base: './' })
        .pipe($.ghPages({
            branch: 'master',
            cacheDir: '.master',
            message: commitMessage,
            force: true
        }));

    return merge(clean, push);
});

gulp.task('deploy-pages', function (cb) {
    runSequence(['get-commit', 'build'], 'gh-pages', cb);
});

gulp.task('deploy-master', function (cb) {
    runSequence(['get-commit', 'readme'], 'gh-master', cb);
});

gulp.task('serve', ['assets'], function () {
    browserSync.init({
        notify: true,
        logPrefix: 'logos',
        server: {
            baseDir: ['.tmp', 'app', './'],
            middleware: [middleware],
            routes: {
                '/bower_components': './bower_components'
            }
        }
    });

    gulp.watch('app/styles/**/*.scss', function (e) {
        if (e.type === 'changed') {
            gulp.start('styles');
        }
    });

    gulp.watch('app/logos.json', ['readme']);
    gulp.watch(['app/*.html', '.tmp/assets/app.js', 'app/media/**/*', 'app/logos.json']).on('change', function () {
        browserSync.reload();
    });
});

gulp.task('build', function (cb) {
    process.env.NODE_ENV = 'production';
    runSequence('clean', 'lint', 'readme', 'assets', ['media', 'bundle'], 'sizer', cb);
});

gulp.task('default', ['serve']);
