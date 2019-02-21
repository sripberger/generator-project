const Subgenerator = require('../../base-classes/subgenerator');
const { dependencies, devDependencies } = require('./dependencies');

/**
 * Subgenerator for elements common to all package scaffolds.
 */
class BaseGenerator extends Subgenerator {
	generateScaffold() {
		// Copy all base templates.
		this.fs.copyTpl(
			this.templatePath('./**/*'),
			this.destinationPath(),
			{
				name: this.options.name,
				description: this.options.description,
				author: this.options.author,
				license: this.options.license,
				repository: this.getRepository(),
			},
			{}, // Options passed to EJS here.
			{ globOptions: { dot: true } } // Include .eslintrc files.
		);

		// Prepend dot to the npmignore file name.
		this.fs.move(
			this.destinationPath('npmignore'),
			this.destinationPath('.npmignore')
		);

		// Prepend dot to the gitignore file name.
		this.fs.move(
			this.destinationPath('gitignore'),
			this.destinationPath('.gitignore')
		);

		// Prepend dot to the eslintignore file name.
		this.fs.move(
			this.destinationPath('eslintignore'),
			this.destinationPath('.eslintignore')
		);

		// Install dependencies and dev dependencies.
		this.npmInstall(dependencies, { save: true });
		this.npmInstall(devDependencies, { 'save-dev': true });
	}
}

module.exports = BaseGenerator;
