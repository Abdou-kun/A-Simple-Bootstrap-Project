// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Use dart-sass for @use
//sass.compiler = require('dart-sass');

// Sass Task
function scssTask() {
	return src('assets/sass/style.sass', { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(dest('assets/css', { sourcemaps: true }));
}

// JavaScript Task
function jsTask() {
	return src('assets/js/index.js', { sourcemaps: true })
		.pipe(babel({ presets: ['@babel/preset-env'] }))
		.pipe(terser())
		.pipe(dest('assets/js', { sourcemaps: true }));
}

// Browsersync
function browserSyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: '.',
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

// Watch Task
function watchTask() {
	watch('*.html', browserSyncReload);
	watch(
		['assets/sass/**/*.scss', 'assets/**/*.js'],
		series(scssTask, jsTask, browserSyncReload)
	);
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);