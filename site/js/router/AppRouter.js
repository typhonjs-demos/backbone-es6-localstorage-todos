'use strict';

import Backbone   from 'backbone';

import appState   from 'pathSite/js/models/appState.js';

/**
 * Provides a basic `Backbone.Router` to route between app states: `all`, `active` & `completed`. When a user
 * navigates between these different filter type states `Backbone.history.navigate` is invoked in `App.js->selectFilter`
 * to update the navigation history allowing the user to use the back and forward browser controls to navigate the app.
 * When a filter type is selected it is referenced in the current URL for the web app. 
 *
 * Please note that in `App.js->s_INITIALIZE_ROUTES` a default catch all no route callback is specified which handles
 * unmatched routes.
 */
export default class AppRouter extends Backbone.Router
{
   /**
    * Creates the routes delegated to the given methods specified.
    */
   constructor()
   {
      super(
      {
         routes:
         {
            'all': () => { appState.set({ filter: 'all' }); },
            'active': () => { appState.set({ filter: 'active' }); },
            'completed': () => { appState.set({ filter: 'completed' }); }
         }
      });
   }
}
