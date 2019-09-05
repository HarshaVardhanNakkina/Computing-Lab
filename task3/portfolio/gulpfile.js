const { series, src, dest, watch } = require('gulp');

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
// function clean(cb) {
//   // body omitted
//   cb();
// }

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
// function build(cb) {
//   // body omitted
//   cb();
// }

var sass = require('gulp-sass');
sass.compiler = require('node-sass');

function sassToCSS(cb) {
	return src('./styles/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(dest('./styles'));
	cb();
}

exports.default = function() {
	// watch('./styles/sass/*.scss', ['sass']);
	watch('./styles/sass/*.scss', series(sassToCSS));
};
