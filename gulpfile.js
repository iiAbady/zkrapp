const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const fsn = require('fs-nextra');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const project = ts.createProject('tsconfig.json');

async function clean() {
	await fsn.emptydir('dist');
}

gulp.task('backend', () => project.src()
	.pipe(sourcemaps.init())
	.pipe(project())
	.js
	.pipe(sourcemaps.write('.', { sourceRoot: '../src' }))
	.pipe(gulp.dest('dist')));

gulp.task('views', () => gulp.src('src/views/**/*.ejs').pipe(gulp.dest('dist/views')));

gulp.task('serve', done => {
	let started = false;

	return nodemon({
		watch: ['dist/**/*.js', 'dist/**/*.ejs'],
		env: { NODE_ENV: 'development' },
		ext: 'js'
	  })
	  .on('start', () => {
		  if (started) return;

	      started = true;
		  browserSync.init({
		  ghostMode: true,
		  proxy: 'http://localhost:80',
		  port: 3000,
		  reloadDelay: 1e3
			});

			done();
	  });
});

function reload(done, ms = 500) {
	setTimeout(() => {
	  browserSync.reload();
	  done();
	}, ms);
}

function watch() {
	gulp.watch('src/views/**/*.ejs', gulp.series('views', reload));
	gulp.watch('src/**/*.ts', gulp.series('backend', done => reload(done, 5e3)));
}

gulp.task('default', gulp.series(clean, 'backend', 'views'));
gulp.task('build', gulp.series(clean, 'backend', 'views'));
gulp.task('watch', gulp.series('build', gulp.parallel('serve', watch)));
