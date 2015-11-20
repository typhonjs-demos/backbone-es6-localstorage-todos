/**
 * Provides the main entry point to the web app first invoking `parseinit` which is a component mapped via
 * `package.json->jspm->dependencies` to `typhonjs-core-parse-init`. `parseinit` will initialize the Parse API by
 * loading `production-config.js` which is mapped to `parseconfig` in `config-app-paths.js`. Please see `indexSrc.html`
 * and notice that `config-app-paths.js` is loaded after `config.js` is loaded.
 */

'use strict';

import App  from  'pathSite/js/App.js';

// Create and initialize the app
new App();