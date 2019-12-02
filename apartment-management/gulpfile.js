const { src, dest, parallel, watch } 	= require('gulp');
const csso					= require('gulp-csso');
const concat				= require('gulp-concat');
const autoprefixer	= require('gulp-autoprefixer');
const markdownPdf 	= require('gulp-markdown-pdf');


const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

function css() {
  return src('css/**/*.css')
		.pipe(concat('styles.min.css'))
		.pipe(autoprefixer())
		.pipe(csso())
    .pipe(dest('static/styles'))
}

function jsDeferable() {
		return src('js/deferable/**/*.js')
		.pipe(babel({presets: ['@babel/env']}))
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('static/js'))
}

function jsEssential() {
	return src('js/essential/**/*.js')
	.pipe(babel({presets: ['@babel/env']}))
	.pipe(concat('essential.min.js'))
	.pipe(uglify())
	.pipe(dest('static/js'))
}

function md2pdf() {
	 return src('./README.MD').pipe(markdownPdf()).pipe(dest('./'))
}

// exports.js = js;
// exports.css = css;
// exports.default = parallel(css, js);
exports.default = function() {
	watch('css/**/*.css',{ delay: 1000, ignoreInitial: false  }, css);
	watch('js/deferable/**/*.js',{ delay0: 1000, ignoreInitial: false }, jsDeferable);
	watch('js/essential/**/*.js',{ delay0: 1000, ignoreInitial: false }, jsEssential);
	watch('./README.MD', {delay: 1000, ignoreInitial: false}, md2pdf)
}