const { src, dest, parallel, watch } = require('gulp');
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

function css() {
  return src('css/**/*.css')
		.pipe(concat('styles.min.css'))
		.pipe(autoprefixer())
		.pipe(csso())
    .pipe(dest('static/styles'))
}

function js() {
		return src('js/**/*.js')
		.pipe(babel({presets: ['@babel/env']}))
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('static/js'))
}

exports.js = js;
exports.css = css;
// exports.default = parallel(css, js);
exports.default = function() {
	watch('css/**/*.css',{ delay: 1000 }, css);
	watch('js/**/*.js',{ delay0: 1000 }, js);
}