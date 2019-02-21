const Subgenerator = require('../../base-classes/subgenerator');
const basePath = require.resolve('../../internal/base');
const libraryPath = require.resolve('../../internal/library');

/**
 * Subgenerator for packages that export a JS library.
 */
class LibraryProjectGenerator extends Subgenerator {
	generateScaffold() {
		// First, generate the base scaffold.
		this.composeWith(basePath, this.options);

		// Next, generate the remaining library scaffold.
		this.composeWith(libraryPath, this.options);
	}
}

module.exports = LibraryProjectGenerator;
