const { Command } = require("commander"),
		chalk = require("chalk"),
		pkg = require("../package.json"),
		gulpBuild = require("./build");

const program = new Command();

program
		.name("svg2font")
		.usage("[command] [options]")
		.description(pkg.description)
		.version(pkg.version, "-v, --version", "版本信息")
		.helpOption("-h, --help", "帮助信息")
		.showHelpAfterError(chalk.blue.bold("('svg2font -h' 查看工具信息)"))
		.addHelpCommand("help [command]", "查看命令信息");

program
		.command("change")
		.description("将当前目录下的svg文件转换为iconfont")
		.option("-c, --class-name  <char>", "字体图标的样式名称，默认 icon", "icon")
		.option("-f, --font-name <char>", "字体图标的字体名称，默认 iconfont", "iconfont")
		.action((options) => {
			process.env.SVG_PATH = process.cwd();
			process.env.SVG_FONT_NAME = options.fontName;
			process.env.SVG_FONT_CLASS = options.className;
			gulpBuild();
		});

program.parse();
