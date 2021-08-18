// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const pug = require('gulp-pug');
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const notify = require('gulp-notify');
const ftp = require('vinyl-ftp');
const concat = require('gulp-concat');
// const uglify = require('gulp-uglify');
const jsmin = require('gulp-jsmin');
// Use dart-sass for @use
//sass.compiler = require('dart-sass');

// Sass Task
function scssTask() {
	return src('src/sass/style.sass', { sourcemaps: true })
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist/assets/css'))
		.pipe(notify("sass Task is already done :)"));
}

// JavaScript Task
function jsTask() {
	return src('src/js/*.js', { sourcemaps: true })
		.pipe(sourcemaps.init())
		.pipe(jsmin())
		.pipe(concat('index.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist/assets/js/'))
		.pipe(notify("js task is already done :)"));
}
// pug task
function pugTask() {
	return src('src/pug/index.pug', { sourcemaps: true })
		.pipe(pug({pretty: true}))
		.pipe(dest('dist'))
		.pipe(notify("Pug task is already done :)"));
}

// // live reload 
// gulp.task('connect', function() {
// 	connect.server({
// 		root: 'app',
// 		livereload: true
// 	});
// });

// Browsersync
function browserSyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: 'dist',
		},
		notify: {
			styles: {
				top: 'auto',
				bottom: '0',
			},
		},
	});
	cb();
}
function browserSyncReload(cb) {
	browsersync.reload();
	cb();
}

// // Compress project files
// gulp.task('compress-project', function () {
// 	return gulp.src('dist/**/*.*')
// 	.pipe(zip('website.zip'))
// 	.pipe(gulp.dest('.'))
// 	.pipe(notify("Files have been compressed :)"))
// })

// // ftp upload design 
// gulp.task( 'deploy', function () {

//     var conn = ftp.create( {
//         host:     'mywebsite.tld',
//         user:     'me',
//         password: 'mypass',
//         parallel: 10
//     } );

//     // var globs = [
//     //     'src/**',
//     //     'css/**',
//     //     'js/**',
//     //     'fonts/**',
//     //     'index.html'
//     // ];

//     // using base = '.' will transfer everything to /public_html correctly
//     // turn off buffering in gulp.src for best performance

//     return gulp.src( globs, { base: '.', buffer: false } )
//         .pipe( conn.newer( '/public_html' ) ) // only upload newer files
//         .pipe( conn.dest( '/public_html' ) );
// } );

// Watch Task
function watchTask() {
	watch('dist/*.html', browserSyncReload);
	watch('src/sass/*.sass', series(scssTask, browserSyncReload)
	);
	watch('src/js/*.js', series(jsTask, browserSyncReload))
	watch("src/pug/*.pug", pugTask);
}

// Default Gulp Task
exports.default = series(browserSyncServe, watchTask);