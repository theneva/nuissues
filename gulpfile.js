var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');

gulp.task('jshint', function() {
	gulp.src(['./angular/js/**/*.js', './server/**/*.js', '!./server/node_modules'])
		.pipe(jshint())
		.pipe(jshint.reporter(jshintStylish));
});

gulp.task('dev', function() {
	gulp.watch(['./**/*.js', '!./**/node_modules/**'], ['jshint']);
});
