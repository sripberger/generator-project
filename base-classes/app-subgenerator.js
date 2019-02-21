const Subgenerator = require('./subgenerator');

/**
 * Base class for application project subgenerators.
 * Adds the `command` option.
 */
class AppSubgenerator extends Subgenerator {
	constructor(args, opts) {
		super(args, opts);

		this.option('command', {
			description: 'Application command',
			type: String,
			default: this.options.name,
		});
	}
}

module.exports = AppSubgenerator;
