const _ = require('lodash');
const Subgenerator = require('../../base-classes/subgenerator');

/**
 * Subgenerator for packages that export a JS library.
 */
class LibraryGenerator extends Subgenerator {
	generateScaffold() {
		// First, generate the base scaffold.
		const baseOptions = _.assign({}, this.options, {
			// Include the main property in package.json.
			packageProperties: { main: 'cjs' },
		});
		this.composeWith(require.resolve('../base'), baseOptions);

		// Copy the CommonJS compatibility wrapper.
		this.fs.copyTpl(
			this.templatePath('cjs.js'),
			this.destinationPath('cjs.js')
		);

		// Copy the library index.
		this.fs.copyTpl(
			this.templatePath('lib.js'),
			this.destinationPath('lib', 'index.js')
		);
	}
}

module.exports = LibraryGenerator;
