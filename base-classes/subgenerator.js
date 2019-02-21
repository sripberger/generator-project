const Generator = require('./generator');

/**
 * Base class for all subgenerators in this project.
 * Adds the `name`, `description`, `author`, and `license` options.
 */
class Subgenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.option('name', {
			description: 'NPM package name',
			type: String,
			default: this.getDefaultName(),
		});

		this.option('description', {
			description: 'NPM package description',
			type: String,
		});

		this.option('author', {
			description: 'NPM author field',
			type: String,
		});

		this.option('license', {
			description: 'NPM license field',
			type: String,
			default: 'MIT',
		});
	}
}

module.exports = Subgenerator;
