const gulp = require('gulp');
const fsn = require('fs-nextra');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const ejs = require('gulp-ejs');
const project = ts.createProject('tsconfig.json');

async function clean() {
	await fsn.emptydir('dist');
}

function website() {
	return gulp.src('src/views/**/*.ejs').pipe(ejs()).pipe(gulp.dest('dist/views'));
}

function scripts() {
	return project.src()
		.pipe(sourcemaps.init())
		.pipe(project())
		.js
		.pipe(sourcemaps.write('.', { sourceRoot: '../src' }))
		.pipe(gulp.dest('dist'));
}

async function build() {
	await clean();
	await website();
	return scripts();
}

function watch() {
	gulp.watch('src/views/*.ejs', website);
	gulp.watch('src/**/*.ts', scripts);
}

gulp.task('default', build);
gulp.task('build', build);
gulp.task('watch', watch);
