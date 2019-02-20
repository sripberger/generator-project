// Scripts specific to the application generator should be exported here.
// They will be added to package.json for application projects only.
module.exports = {
	postversion: 'git push && git push --tags',
};
