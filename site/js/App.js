'use strict';

import Backbone         from 'backbone';
import eventbus         from 'mainEventbus';

import AppRouter        from 'pathSite/js/router/AppRouter.js';
import ManageTodosView  from 'pathSite/js/views/ManageTodosView.js';

import appState         from 'pathSite/js/models/appState.js';
import todoList         from 'pathSite/js/collections/todoList.js';

/**
 * Provides the main entry point for the Todos app and major control functionality (the C in MVC). This control
 * functionality is exposed over an eventbus created by `mainEventbus.js`. `typhonjs-backbone-parse` provides
 * additional functionality particularly for `Backbone.Events` adding the ability to invoke asynchronous actions
 * over the eventbus using the `triggerThen` method which resolves any Promises returned by event targets.
 *
 * While in this simple app there is only one view of the `TodoList` a benefit of separating control functionality and
 * the `TodoList` instance from a specific view is that it could be used across multiple views.
 *
 * Please note that all Parse specific API access is isolated in this class. By isolating Parse API access to
 * just this class if the app was rewritten to use a different backend then only this class needs to be modified
 * to support the new backend API after selecting an alternate Backbone implementation.
 */
export default class App
{
   /**
    * Wires up the main eventbus, invokes the private s_INITIALIZE_ROUTE function which creates `AppRouter` and sets up
    * a catch all handler then invokes `Backbone.history.start` with the root path and finally the constructor shows the
    * proper view based on whether there is a current logged in user.
    */
   constructor()
   {
      // Wire up the main eventbus to respond to the following events. By passing in `this` in the third field to
      // `on` that sets the context when the callback is invoked.
      eventbus.on('app:create:item', this.createItem, this);
      eventbus.on('app:select:filter', this.selectFilter, this);

      // Invokes a private method to initialize the `AppRouter`, add a default catch all handler, and start
      // `Backbone.history`.
      s_INITIALIZE_ROUTE();

      /**
       * Creates the initial displayed view based given if a user is currently logged into the app.
       *
       * @type {View} Stores the current active view.
       */
      this.currentView = this.showTodos();
   }

   /**
    * Creates a new Item in the todos list. Note the addition of user which becomes a Parse pointer and an
    * Parse.ACL (access control list) which limits the item to be only accessible to the current user.
    *
    * @param {string}   content - The text for the item.
    */
   createItem(content)
   {
      // Ensure that content is a string. If so then create a new `Item` entry in `todoList`.
      if (typeof content === 'string')
      {
         todoList.create(
         {
            content,
            order: todoList.nextOrder(),
            done: false
         });
      }
   }

   /**
    * Sets the app state with the new filter type and updates `Backbone.History`.
    *
    * @param {string}   filter - Filter type to select.
    */
   selectFilter(filter)
   {
      // When setting a value on a `Backbone.Model` if the value is the same as what is being set a change event will
      // not be fired. In this case we set the new state with the `silent` option which won't fire any events then
      // we manually trigger a change event so that any listeners respond regardless of the original state value.
      appState.set({ filter }, { silent: true });
      appState.trigger('change', appState);

      // Update the history state with the new filter type.
      Backbone.history.navigate(filter);
   }

   /**
    * Creates and shows a new ManageTodosView then fetches the collection.
    *
    * @returns {*}
    */
   showTodos()
   {
      if (this.currentView) { this.currentView.close(); }

      Backbone.history.navigate(appState.get('filter'), { replace: true });

      this.currentView = new ManageTodosView();

      // Fetch all the todos items from local storage. Any listeners for `todoList` reset events will be invoked.
      todoList.fetch({ reset: true });

      return this.currentView;
   }
}

/**
 * A private function in the module scope, but outside of the class which initializes the `AppRouter`, adds a default
 * catch all handler, and start `Backbone.history`.
 */
const s_INITIALIZE_ROUTE = () =>
{
   new AppRouter();

   // Defines a catch all handler for all non-matched routes (anything that isn't `all`, `active` or `completed`). If
   // a user is logged in the catch all navigates to `all` triggering the route and replacing the invalid route in
   // the browser history.
   Backbone.history.handlers.push(
   {
      route: /(.*)/,
      callback: () => { Backbone.history.navigate('all', { trigger: true, replace: true }); }
   });

   // This regex matches the root path, so that it can be set in `Backbone.history.start`
   let root, urlMatch;

   // Construct the root path to the web app which is the path above the domain that may include `index.html` or
   // `indexSrc.html` depending on the runtime. For instance in WebStorm when creating a local server `index.html` is
   // included in the URL. Running on an actual web server often `index.html` is not put into the URL. When running the
   // app from source code transpiled in the browser `indexSrc.html` is always in the URL.
   if (typeof window.location !== 'undefined')
   {
      const windowLocation = window.location.toString();

      if (windowLocation.includes('.html'))
      {
         urlMatch = windowLocation.match(/\/\/[\s\S]*\/([\s\S]*\/)([\s\S]*\.html)/i);
         root = urlMatch && urlMatch.length >= 3 ? `${urlMatch[1]}${urlMatch[2]}` : undefined;
      }
      else
      {
         urlMatch = windowLocation.match(/\/\/[\s\S]*\/([\s\S]*\/)/i);
         root = urlMatch && urlMatch.length >= 2 ? urlMatch[1] : undefined;
      }
   }

   Backbone.history.start({ root });
};