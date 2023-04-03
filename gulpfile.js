"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const concatCss = require('gulp-concat-css');
const sourcemaps = require("gulp-sourcemaps");
const delMod = require("del");
const ts = require("gulp-typescript");
const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const source = require("vinyl-source-stream");
const path = require("path");
const rename = require("gulp-rename");
const gulpif = require("gulp-if");
const uglifyes = require("uglify-es");
const composer = require("gulp-uglify/composer");
const uglifycss = require("gulp-uglifycss");
const LIBS = require("./libs.json");
let env = 'dev';
const minify = composer(uglifyes, console);

function copy(src, dst, renameArg) {
	if (renameArg === undefined) {
		return () => gulp.src(src).pipe(gulp.dest(dst));
	} else {
		return () => gulp.src(src).pipe(rename(renameArg)).pipe(gulp.dest(dst));
	}
}

function del(paths) {
	return () => delMod(paths, { force: true });
}

gulp.task(
	"pre-prod",
	function (cb) {
		env = 'production';
		console.log(env);
		cb();
	}
);

gulp.task(
	"copy-lib",
	gulp.series(
		copy("./src/assets/**/*.*", "./app/assets"),
		(cb) => {
			for (let item of LIBS) {
				gulp.src(item.from).pipe(gulp.dest(item.to));
			}
			cb();
		}
	)
);

gulp.task(
	"del-lib",
	del(["./app/libs", "./app/assets"])
);

gulp.task(
	"copy-html",
	copy("./src/**/*.html", "./app")
);

gulp.task(
	"del-html",
	del(
		[
			"./app/*",
			!"./app/index.js",
			!"./app/index.css",
			!"./app/libs",
			!"./app/assets"
		]
	)
);

gulp.task("styles", function() {
	return gulp.src("./src/**/*.scss")
		.pipe(gulpif(env === 'dev', sourcemaps.init()))
		.pipe(sass())
		.pipe(gulpif(env === 'dev', sourcemaps.write()))
		.pipe(gulp.dest("./temp"));
});

gulp.task("concat-css", function () {
	return gulp.src('./temp/**/*.css')
		.pipe(concatCss("index.css"))
		.pipe(gulpif(env === 'production', uglifycss()))
		.pipe(gulp.dest('./app/'));
});

gulp.task("del-css", del(["./app/index.css"]));

gulp.task("del-temp", del(["./temp/"]));

gulp.task("del-all", del(["./app"]));


gulp.task("tsc", function() {
	const tsProject = ts.createProject("tsconfig.json");
	const tsResult = tsProject.src()
		.pipe(gulpif(env === 'dev', sourcemaps.init()))
		.pipe(tsProject());
	return tsResult.js
		.pipe(gulpif(env === 'dev', sourcemaps.write()))
		.pipe(gulp.dest("./temp"));
});

function browserifySubTask(browserifyEntry, destFolder) {
	const entryFileName = path.basename(browserifyEntry);
	return gulp.series(
		del([ path.join(destFolder, entryFileName) ]),
		() => browserify({
			entries: browserifyEntry,
			debug: true
		}).bundle()
			.pipe(source(entryFileName))
			.pipe(buffer())
			.pipe(gulpif(env === 'dev', sourcemaps.init({loadMaps: true})))
			.pipe(gulpif(env === 'dev', sourcemaps.write('')))
			.pipe(gulpif(env === 'production', minify({}).on('error', function (err) {
				console.log(err);
			})))
			.pipe(gulp.dest(destFolder))
	);
}

gulp.task(
	"browserify",
	browserifySubTask(
		"./temp/index.js",
		"./app",
	),
);


gulp.task("create-lib", gulp.series("copy-lib"));
gulp.task("create-html", gulp.series("copy-html"));
gulp.task("create-css", gulp.series("styles", "concat-css"));
gulp.task("create-js", gulp.series("tsc", "browserify"));


gulp.task("help", function(callback) {
	let h = `\nGulp tasks:
	1) "build" - compiles content of folder src, and places result into folder app.
	2) "build:prod" - compiles content of folder src, minimizes and places result into folder app.
	3) "default" - this help message`;
	console.log(h);
	callback();
});

gulp.task(
	"build",
	gulp.series(
		"del-all",
		gulp.parallel(
			"create-lib",
			"create-html",
			"create-css",
			"create-js"
		),
		"del-temp"
	)
);
gulp.task(
	"build:prod",
	gulp.series(
		"pre-prod",
		"build"
	)
);
gulp.task(
	"default",
	gulp.series(
		"help"
	)
);
