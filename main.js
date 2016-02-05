/**
 * Provides the main entry point to the web app first invoking `typhonjs-core-backbone-localstorage` which is a
 * component mapped via `package.json->jspm->dependencies`. `typhonjs-core-backbone-localstorage` bootstraps Backbone
 * replacing the sync adapter with a browser `localStorage` version. Please see `indexSrc.html`
 * and notice that `config-app-paths.js` is loaded after `config.js` is loaded.
 */

'use strict';

import            'typhonjs-core-backbone-localstorage';   // Instruments Backbone for LocalStorage

import App  from  'pathSite/js/App.js';

// Create and initialize the app
new App();