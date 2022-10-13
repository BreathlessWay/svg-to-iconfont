const { src, series, dest, lastRun } = require("gulp"),
		iconfont = require("gulp-iconfont"),
		iconfontCss = require("gulp-iconfont-css"),
		clean = require("gulp-clean"),
		notify = require("gulp-notify"),
		plumber = require("gulp-plumber"),
		chalk = require("chalk"),
		logSymbols = require("log-symbols");

const runTimestamp = Math.round(Date.now() / 1000);

let input = `${process.env.SVG_PATH}/**/*.svg`,
		output = `${process.env.SVG_PATH}/dist`,
		fontName = "iconfont",
		className = "icon";

const cleanDist = () => {
	return src(output, { read: false, allowEmpty: true }).pipe(clean());
};

const build = () => {

	return src(input, {
		since: lastRun(build),
		allowEmpty: true
	})
			.pipe(
					plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
			)
			.pipe(
					iconfontCss({
						fontName,
						targetPath: "font.css", //生成的css样式的路径
						fontPath: "./", //生成的iconfont的路径
						cssClass: className
					})
			)
			.pipe(
					iconfont({
						fontName, // required
						prependUnicode: true, // recommended option
						formats: ["svg", "ttf", "eot", "woff", "woff2"], // default, 'woff2' and 'svg' are available
						timestamp: runTimestamp // recommended to get consistent builds when watching files
					})
			)
			.pipe(
					dest(output)
			);
};

const finish = (cb) => {
	console.log(logSymbols.success, chalk.green.bold("转换完成"));
	console.log(logSymbols.warning, chalk.magenta.bold.underline(`输出目录${output}`));
	cb();
};

module.exports = () => {
	input = `${process.env.SVG_PATH}/**/*.svg`;
	output = `${process.env.SVG_PATH}/dist`;
	fontName = process.env.SVG_FONT_NAME;
	className = process.env.SVG_FONT_CLASS;

	console.log(logSymbols.info, chalk.cyan.bold(`输入目录${input}`));

	series(cleanDist, build, finish)();
};