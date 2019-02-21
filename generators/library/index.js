const _ = require('lodash');
const scripts = require('./scripts');
const Subgenerator = require('../../base-classes/subgenerator');
const { dependencies, devDependencies } = require('./dependencies');

/**
 * Subgenerator for packages that export a JS library.
 */
class LibraryGenerator extends Subgenerator {
	generateScaffold() {
		// First, generate the base scaffold.
		const baseOptions = _.assign({}, this.options, {
			// Include main property and additional scripts for libraries.
			packageProperties: { main: 'cjs', scripts },

			// Append docs paths to ignore files.
			appends: {
				eslintignore: 'docs/\n',
				gitignore: 'docs/\n',
				npmignore: 'docs.yaml\n',
			},
		});
		this.composeWith(require.resolve('../../internal/base'), baseOptions);

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

		// Copy the documentation config file.
		this.fs.copyTpl(
			this.templatePath('docs.yaml'),
			this.destinationPath('docs.yaml')
		);

		// Install additional dependencies and dev dependencies for libraries.
		this.npmInstall(dependencies, { save: true });
		this.npmInstall(devDependencies, { 'save-dev': true });
	}
}

module.exports = LibraryGenerator;
