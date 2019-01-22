const _ = require('lodash');
const Subgenerator = require('../../base-classes/subgenerator');

/**
 * Subgenerator for packages with an executable node program.
 */
class ApplicationGenerator extends Subgenerator {
	constructor(args, opts) {
		super(args, opts);

		this.option('command', {
			description: 'Application command',
			type: String,
			default: this.options.name,
		});
	}

	generateScaffold() {
		const commandFilename = `${this.options.command}.js`;

		// First, generate the base scaffold.
		const baseOptions = _.assign(_.omit(this.options, 'command'), {
			// Include the bin property in package.json.
			packageProperties: { bin: {
				[this.options.command]: `./bin/${commandFilename}`,
			} },
		});
		this.composeWith(require.resolve('../base'), baseOptions);

		// Copy the application bin file.
		this.fs.copyTpl(
			this.templatePath('bin.js'),
			this.destinationPath('bin', commandFilename),
			{ applicationName: this.options.command }
		);

		// Copy the application src file.
		this.fs.copyTpl(
			this.templatePath('src.js'),
			this.destinationPath('src', commandFilename)
		);

		// Copy the application internal lib index.
		this.fs.copyTpl(
			this.templatePath('lib.js'),
			this.destinationPath('lib', 'index.js')
		);
	}
}

module.exports = ApplicationGenerator;
