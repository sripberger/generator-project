#! /usr/bin/env node

// Execute the application with esm.
const esmRequire = require('esm')(module, { await: true });
esmRequire('../src/<%= applicationName %>');
