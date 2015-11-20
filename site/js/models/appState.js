'use strict';

import Backbone from 'backbone';

/**
 * This is the transient application state, not persisted on Parse. By using a `Backbone.Model` this also makes it an
 * instance of `Backbone.Events` allowing subscription to state changes. Exporting an instance of AppState allows
 * any other module to import this instance.
 */
class AppState extends Backbone.Model
{
   /**
    * Sets the `className` necessary for constructing a Backbone.Model with `typhonjs-backbone-parse`.
    *
    * @returns {string}
    */
   get className() { return 'AppState'; }

   /**
    * Returns the default values for AppState which is set in `Backbone.Model` when initializing an instance of
    * `AppState`.
    *
    * @returns {object}
    */
   get defaults() { return { filter: 'all' }; }
}

/**
 * Returns an instance of AppState.
 */
export default new AppState();