'use strict';

import Backbone   from 'backbone';

const eventbus = new Backbone.Events();

/**
 * Exports an instance of `Backbone.Events` which is used as a main eventbus. Note that an instance of `Backbone.Events`
 * is exported and is also associated to a mapped path, `mainEventbus` in the SystemJS extra configuration data loaded
 * in `./config/config-app-paths.js`. By using a mapped path any other module may import the main eventbus via:
 * `import eventbus from 'mainEventbus';`
 *
 * Note the above creation of `const eventbus` is a workaround for an ESDoc bug:
 * https://github.com/esdoc/esdoc/issues/166
 *
 * Normally we can write `export default new Backbone.Events()`, but this currently breaks ESDoc.
 */
export default eventbus;
