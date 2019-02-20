# @sripberger/generator-project
A [yeoman](https://yeoman.io/) generator for my personal JS projects. Feel free
to use it, though I will of course be prioritizing my own needs when maintaining
it.

## Installation
```sh
# Install yo.
npm install -g yo

# Install the generator.
npm install -g @sripberger/generator-project
```


## Running the Generator
Once installed, you can run `yo` with no arguments in the project directory and
select `@sripberger/project` from the list of installed generators. You can also
run it directly like so:

```sh
yo @sripberger/project
```

### Selecting a Project Type
The first thing the generator will ask you is which project type you'd like to
generate, from among the following options:

- **Library**: Exports a node module without providing any executable files.
  Most projects will be libraries.
- **Application**: Has one (or more) executable files. Should not export any
  functionality. Will include any services, internal scripts, and so on.

### Specifying NPM Package Options
The generator will ask you to provide some options to populate
[package.json](https://docs.npmjs.com/files/package.json), including `name`,
`description`, `author`, and `license`, all provided as strings.

`name` defaults to the name of the current working directory, while `license`
defaults to [MIT](https://opensource.org/licenses/MIT). `description` and
`author` can be left blank, though if you do so you should update them later.
NPM can work with packages without these fields, but it will complain.

### Specifying the Command Name (Application Type Only)
If you selected the application type, the generator will also ask you to provide
the name of the command that will be used to run your application when
installed. The generator will create an executable JS file with this name, as
well as a `bin` entry in `package.json` that points at it. This defaults to the
package name you provided.

### Repository Auto-Detection
If you run this in a repository you cloned from GitHub, it will automatically
add an appropriate
[`repository`](https://docs.npmjs.com/files/package.json#repository) field to
`package.json` to point at that same repository. If you begin your project by
some other means, you'll want to manually add this field later. NPM will work
with packages that lack a repository field, but it will print out warnings.

### Skipping the UI
You can run either generator directly in the command line like so:

```sh
yo @sripberger/project:library --author 'Your Name' --license 'ISC'
yo @sripberger/project:application --command 'my-command'
```

Note that any options omitted from your command will use their defaults,
described above.


## ES Modules and the `esm` package.
At the time of this writing, ES modules are in a weird spot in Node. They are
without a doubt better than the old-style CommonJS modules, but Node has a huge
legacy ecosystem written using CommonJS, and backwards compatibility must be
maintained.

For this reason, ES modules are still experimental in Node, and therefore not
ready for production use. We can, however, use the *syntax* of ES modules now to
simplify a possible transition in the future.

This is accomplished using an npm package called
[`esm`](https://www.npmjs.com/package/esm). It wraps each project, maintaining
compatibility with Node and other Node modules.


## Writing a Library
Library code should be placed in the `lib` directory, and any members exported
from the library should be exported from `lib/index.js` using ES module syntax.

Exported library code is wrapped with the `esm` package through a file at the
root of the project called `cjs.js`. This file should not be modified.


## Writing an Application
Application code for should be placed in the `src` folder. By default, a JS
file will exist here with the same name as the command used to run the
application. The code here will be run when that command is run.

This application code is wrapped with the `esm` package through a file located
in the `bin` directory. If you need more commands for your application, you
should repeat this pattern by creating more executable files in the bin folder
that simply wrap application code in the `src` folder. Don't forget to add
these commands to the `bin` entry in `package.json` as described in the
[npm documentation](https://docs.npmjs.com/files/package.json#bin).


## Linting Your Code
All project types include an [ESLint](https://eslint.org/) dev dependency,
along with configuration and an npm script with which to easily run it:

```sh
npm run lint
```

This will inspect all `.js` files in the project and print any problems it finds
out into the console.

When developing, make sure to run the linter regularly and fix any problems.
To make things easier, some problems can be fixed automatically using the
`--fix` flag like so:

```sh
npm run lint -- --fix
```


## Automated Testing
All project types include a [Mocha](https://mochajs.org/) dev dependency, along
with scaffolding for unit and integration tests.

Unit tests should be placed in the `test/unit` directory, while integration
tests should be placed in the `test/integration` directory. Also in the test
folder is the `test/setup.js` file, which is included in every test run. This
file prepares the test suite for the run, and should not include any tests
itself.

NPM scripts are included for running tests:

```sh
# To run unit tests:
npm run unit

# To run integration tests:
npm run integration

# To run linter, followed by unit and integration tests:
npm run test
```

Assertions in your tests should be written using the `chai`
[`expect`](https://www.chaijs.com/api/bdd/) api. `expect` is included as a
global variable in the test suite, so you need not ever import it or configure
it yourself.

Fakes-- which should be used extensively by unit tests for isolation-- can be
easily created using [`sinon`](https://sinonjs.org/). Any fake put in place by
`sinon` will be restored after each test without you having to explicitly do so.
As with `expect`, `sinon` is available globally in the tests, so there is no
need to import it yourself.

Finally, `chai` is extended using
[`sinon-chai`](https://github.com/domenic/sinon-chai), allowing you to easily
write assertions about the fake functions and methods you create with `sinon`.


## Documentation
Doc comments should be written using [JSDoc](http://usejsdoc.org/) syntax. Some,
but not all of this syntax will be checked by the linter using
[eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc).

### Generating Public Docs
In library projects only, public documentation can be generated from these
comments using [documentation.js](https://documentation.js.org/), which allows
you to omit some info from your doc comments and infers them from your code--
things like method names, instance or static membership, and so on.

To generate docs (again, only in library projects), run the following script:

```sh
npm run docs
```

Docs will be output as html in the `docs` folder, allowing you to view them in
the browser of your choice. This folder is ignored by git, but *not* ignored by
npm, so as long as you make sure the docs are rebuilt for each, every published
package version will also include its own version of your docs.

### Configuring Public Docs
`docs.yaml` at the root of a library project generator allows you to configure
the public docs output-- including specifying a table of contents-- as described
[here](https://github.com/documentationjs/documentation/blob/master/docs/CONFIG.md).
By default, though, this file does nothing and simply shows your documented
entities in the order encountered by the parser.

### Publishing Docs
Library projects also have a `gh-pages` dependency, which will be used to
deploy your generated docs to the `gh-pages` branch of your repository, allowing
them to be viewed publicly. Since you should generally only do this when
actually publishing a new release, there is no exposed npm script for doing
this. Instead, it will be handled automatically by the `postversion` script,
described below.


## The `postversion` Script
Before you publish a new version of your package, there's a number of steps
you're always going to want to do:

1. Run [npm version](https://docs.npmjs.com/cli/version.html) to bump the
   version number.
2. Generate public docs (for library projects only).
3. Publish public docs (for library projects only).
4. Push the new commit from `npm version`.
5. Push the new tag from `npm version`.

To make things easier, both project types include a `postversion` script that
will automatically run after each `npm version` run. It will perform all of the
applicable steps between 2 and 5. Once it is finished, all that's left to do is
to run `npm publish` to publish your package to the registry of your choice.
