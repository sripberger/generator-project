const YeomanGenerator = require('yeoman-generator');
const path = require('path');

/**
 * Base class for all generators and subgenerators in this project.
 * Adds some utility methods for getting default values.
 */
class Generator extends YeomanGenerator {
	/**
	 * Gets the default name based on the destination directory name.
	 * @returns {string} Destination dirname.
	 */
	getDefaultName() {
		return path.basename(this.destinationPath());
	}

	/**
	 * Gets the respository field by spawning a git command.
	 * @returns {string|null} Detected repository field, or null if none can be
	 *   determined.
	 */
	getRepository() {
		// Get the origin url from git, if any.
		const url = this._getOriginUrl();
		if (!url) return null;

		// Check for matches against github ssh and https url patterns.
		const ssh = /^git@github.com:(.*?)\/(.*?)\.git$/;
		const https = /https:\/\/github.com\/(.*?)\/(.*?)\.git$/;
		const matches = ssh.exec(url) || https.exec(url);
		if (!matches) return null;

		// Translate to shorthand url as specified in npm docs.
		const [ , user, repo ] = matches;
		return `github:${user}/${repo}`;
	}

	/**
	 * Gets the full origin repo url by spawning a git commmand.
	 * @private
	 * @returns {string|null} Origin repo url, or null if none is found.
	 */
	_getOriginUrl() {
		// Attempt to read the origin repo url from git.
		const { stdout, status } = this.spawnCommandSync(
			'git',
			[ 'config', '--get', 'remote.origin.url' ],
			{ encoding: 'utf8', stdio: 'pipe' }
		);
		if (status !== 0) return null;
		return stdout.trim();
	}
}

module.exports = Generator;
