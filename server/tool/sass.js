// page module ui  scss 2 css  - cqh
let gulp = require('gulp');
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');

// page and module scss2css
let projectPath = './src/web';
let inputPath = projectPath + '/scss/**/*.scss';
let outPath = projectPath + '/css';

let includeArr = [
    projectPath + '/scss',
    projectPath + '/scss/module',
    './src/edu/scss/',
    './lib/res-base/scss/',
    './lib/res-base/css/',
    './src/web/javascript/ui/',
    './res/'];

gulp.task('scss', function () {
    return gulp.src(inputPath)
        .pipe(sourcemaps.init())
        .pipe(sass({
            'outputStyle': 'nested',
            'errLogToConsole': true,
            'includePaths': includeArr
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('/map'))
        .pipe(gulp.dest(outPath));
});

// ui scss2css
let uiInputPath = projectPath + '/javascript/ui/**/*.scss';
let uiOutPath = projectPath + '/javascript/ui';

gulp.task('scss-ui', function () {
    return gulp.src(uiInputPath)
        .pipe(sass({
            'outputStyle': 'nested',
            'errLogToConsole': true,
            'includePaths': includeArr
        }).on('error', sass.logError))
        .pipe(gulp.dest(uiOutPath));
});

// watch
gulp.task('watch:scss', ['scss', 'scss-ui'], function () {
    console.log('********您已开启watch*********');
    let cssWatcher = gulp.watch([
        inputPath,
        './src/web/javascript/ui/**/*.scss'
    ], ['scss', 'scss-ui']);
    cssWatcher.on('change', function (event) {
        console.log('file ' + event.path + ' was ' + event.type);
    });
});

gulp.task('watch', ['watch:scss']);
