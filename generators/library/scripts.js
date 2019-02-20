// Scripts specific to the lib generator should be exported here.
// They will be added to package.json for lib projects only.
module.exports = {
	docs: 'documentation build ./lib/index.js -c docs.yaml -f html -o docs',
	postversion: 'npm run docs && ' +
		'gh-pages -d docs && ' +
		'git push && ' +
		'git push --tags',
};
