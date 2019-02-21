const Subgenerator = require('../../base-classes/subgenerator');
const basePath = require.resolve('../../internal/base');
const applicationPath = require.resolve('../../internal/application');

/**
 * Subgenerator for packages with an executable node program.
 */
class ApplicationProjectGenerator extends Subgenerator {
	constructor(args, opts) {
		super(args, opts);

		this.option('command', {
			description: 'Application command',
			type: String,
			default: this.options.name,
		});
	}

	generateScaffold() {
		// First, generate the base scaffold.
		this.composeWith(basePath, this.options);

		// Next, generate the remaining application scaffold.
		this.composeWith(applicationPath, this.options);
	}
}

module.exports = ApplicationProjectGenerator;
