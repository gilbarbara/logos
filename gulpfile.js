var gulp        = require('gulp'),
    ghPages     = require('gulp-gh-pages');

gulp.task('deploy', function () {
    return gulp.src(['*.svg', '*.html', '*.md'])
        .pipe(ghPages({
            force: true
        }));
});

gulp.task('default', ['deploy']);
