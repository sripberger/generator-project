const Subgenerator = require('../../base-classes/subgenerator');
const scripts = require('./scripts');

/**
 * Subgenerator for elements unique to application projects.
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

		// Add bin property and application scripts to package.json.
		this.fs.extendJSON(this.destinationPath('package.json'), {
			bin: { [this.options.command]: `./bin/${commandFilename}` },
			scripts,
		});

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
