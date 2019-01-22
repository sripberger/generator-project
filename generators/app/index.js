const _ = require('lodash');
const Generator = require('../../base-classes/generator');

/**
 * Default project generator. Allows the user to select a project type and enter
 * other necessary options.
 */
class ProjectGenerator extends Generator {
	async promptForAnswers() {
		// Prompt the user for options.
		this.answers = await this.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'Select a project type.',
				choices: [ 'library', 'application' ],
			},
			{
				type: 'input',
				name: 'name',
				message: 'Enter the package name.',
				default: this.getDefaultName(),
			},
			{
				type: 'input',
				name: 'description',
				message: 'Enter the package description.',
			},
			{
				type: 'input',
				name: 'author',
				message: 'Enter an author field.',
			},
			{
				type: 'input',
				name: 'license',
				message: 'Enter a license field.',
				default: 'MIT',
			},
			{
				when: (answers) => answers.type === 'application',
				type: 'input',
				name: 'command',
				message: 'Enter the command name for your application.',
				default: (answers) => answers.name,
			},
		]);
	}

	generateScaffold() {
		// Run the selected subgenerator with the specified options.
		this.composeWith(
			require.resolve(`../${this.answers.type}`),
			_.omit(this.answers, 'type')
		);
	}
}

module.exports = ProjectGenerator;
