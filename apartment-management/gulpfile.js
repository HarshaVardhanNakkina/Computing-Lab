const { src, dest, watch } = require('gulp');
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');

function css() {
  return src('css/**/*.css')
		.pipe(csso())
		.pipe(autoprefixer())
    .pipe(concat('styles.min.css'))
    .pipe(dest('static/styles'))
}

function js() {
		return src('js/**/*.js')
		.pipe(babel({presets: ['@babel/env']}))
    .pipe(concat('app.min.js'))
    .pipe(dest('static/js'))
}

exports.js = js;
exports.css = css;
// exports.default = parallel(css, js);
exports.default = function() {
	watch('css/**/*.css',{ delay: 1000 }, css);
	watch('js/**/*.js',{ delay0: 1000 }, js);
}