const Subgenerator = require('../../base-classes/subgenerator');
const scripts = require('./scripts');
const { devDependencies } = require('./dependencies');

/**
 * Subgenerator for elements unique to library projects.
 */
class LibraryGenerator extends Subgenerator {
	generateScaffold() {
		// Add main property and library scripts to package.json.
		this.fs.extendJSON(this.destinationPath('package.json'), {
			main: 'cjs',
			scripts,
		});

		// Append docs paths to ignore files.
		this.fs.append(this.destinationPath('.eslintignore'), 'docs\n');
		this.fs.append(this.destinationPath('.gitignore'), 'docs\n');
		this.fs.append(this.destinationPath('.npmignore'), 'docs.yaml\n');


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

		// Install additional dev dependencies for libraries.
		this.npmInstall(devDependencies, { 'save-dev': true });
	}
}

module.exports = LibraryGenerator;
