const Subgenerator = require('../../base-classes/subgenerator');
const { dependencies, devDependencies } = require('./dependencies');

/**
 * Subgenerator for elements common to all package scaffolds.
 * Included as part of all other subgenerators.
 */
class BaseGenerator extends Subgenerator {
	constructor(args, opts) {
		super(args, opts);

		this.option('packageProperties', {
			description: 'Additional properties to add to package.json',
			type: Object,
			default: {},
		});


		this.option('appends', {
			description: 'Strings to append to template files, ' +
				'keyed by template path',
			type: Object,
			default: {},
		});
	}

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

		// Add additional specified properties to package.json.
		this.fs.extendJSON(
			this.destinationPath('package.json'),
			this.options.packageProperties
		);

		// Append specified strings to template files
		for (const file in this.options.appends) {
			this.fs.append(
				this.destinationPath(file),
				this.options.appends[file]
			);
		}

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

		// Install all dependencies and dev dependencies.
		this.npmInstall(dependencies, { save: true });
		this.npmInstall(devDependencies, { 'save-dev': true });
	}
}

module.exports = BaseGenerator;
